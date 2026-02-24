require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const { create: createYtDlp } = require('youtube-dl-exec');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const ytdlpPath = '/opt/venv/bin/yt-dlp';
const youtubedl = createYtDlp(ytdlpPath);
const cookiesPath = path.join(__dirname, 'cookies.txt');

const app = express();
const PORT = process.env.PORT || 3000;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const youtube = google.youtube({
  version: 'v3',
  auth: YOUTUBE_API_KEY
});

app.use(cors());
app.use(express.json());

// ── Helper: get yt-dlp version ───────────────────────────────────
function getYtDlpVersion() {
  try {
    return execSync(`${ytdlpPath} --version`, { encoding: 'utf-8' }).trim();
  } catch {
    return 'unknown';
  }
}

// ── Helper: validate cookies ─────────────────────────────────────
function getCookieStatus() {
  if (!fs.existsSync(cookiesPath)) {
    return { loaded: false, reason: 'File not found' };
  }
  const content = fs.readFileSync(cookiesPath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim() && !l.startsWith('#'));
  if (lines.length === 0) {
    return { loaded: false, reason: 'File is empty or only has comments', size: content.length };
  }
  // Check if it contains YouTube domain cookies
  const hasYtCookies = content.includes('.youtube.com') || content.includes('.google.com');
  return {
    loaded: true,
    valid: hasYtCookies,
    entries: lines.length,
    size: content.length,
    reason: hasYtCookies ? 'OK' : 'No YouTube/Google cookies found'
  };
}

// ── Root endpoint ─ health check ─────────────────────────────────
app.get('/', (req, res) => {
  const cookieStatus = getCookieStatus();
  res.json({
    name: 'DarkTube Server',
    version: '1.2.0',
    status: 'online',
    health: 'ok',
    environment: process.env.NODE_ENV || 'production',
    region: process.env.YOUTUBE_REGION_CODE || 'ID',
    ytdlpVersion: getYtDlpVersion(),
    cookies: cookieStatus
  });
});

// ── Search videos ────────────────────────────────────────────────
app.get('/api/search', async (req, res) => {
  try {
    const { q, maxResults = 10, pageToken } = req.query;

    if (!YOUTUBE_API_KEY) {
      return res.status(500).json({ error: 'YouTube API Key is not configured' });
    }

    const response = await youtube.search.list({
      part: 'snippet',
      q: q,
      type: 'video',
      maxResults: parseInt(maxResults),
      pageToken: pageToken
    });

    const videos = response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnails: item.snippet.thumbnails,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt
    }));

    res.json({
      videos,
      nextPageToken: response.data.nextPageToken,
      prevPageToken: response.data.prevPageToken
    });
  } catch (error) {
    console.error('Error searching videos:', error);
    res.status(500).json({ error: error.message });
  }
});

// ── Trending videos ──────────────────────────────────────────────
app.get('/api/trending', async (req, res) => {
  try {
    const { maxResults = 10, pageToken, regionCode } = req.query;

    if (!YOUTUBE_API_KEY) {
      return res.status(500).json({ error: 'YouTube API Key is not configured' });
    }

    const response = await youtube.videos.list({
      part: 'snippet,contentDetails,statistics',
      chart: 'mostPopular',
      regionCode: regionCode || process.env.YOUTUBE_REGION_CODE || 'ID',
      maxResults: parseInt(maxResults),
      pageToken: pageToken
    });

    const videos = response.data.items.map(item => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnails: item.snippet.thumbnails,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      statistics: item.statistics
    }));

    res.json({
      videos,
      nextPageToken: response.data.nextPageToken,
      prevPageToken: response.data.prevPageToken
    });
  } catch (error) {
    console.error('Error fetching trending videos:', error);
    res.status(500).json({ error: error.message });
  }
});

// ── Video details ────────────────────────────────────────────────
app.get('/api/video/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const response = await youtube.videos.list({
      part: 'snippet,contentDetails,statistics',
      id: id
    });

    if (response.data.items.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(response.data.items[0]);
  } catch (error) {
    console.error('Error fetching video details:', error);
    res.status(500).json({ error: error.message });
  }
});

// ── Stream URL extraction with fallback ──────────────────────────
app.get('/api/stream', async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Video ID is required' });
    }

    const videoUrl = `https://www.youtube.com/watch?v=${id}`;
    const hasCookies = fs.existsSync(cookiesPath);

    // Strategies to try in order - different player clients bypass different restrictions
    const strategies = [
      { name: 'ios+cookies', client: 'ios', useCookies: hasCookies },
      { name: 'android+cookies', client: 'android', useCookies: hasCookies },
      { name: 'mweb+cookies', client: 'mweb', useCookies: hasCookies },
      { name: 'web+cookies', client: 'web', useCookies: hasCookies },
      { name: 'ios_no_cookies', client: 'ios', useCookies: false },
      { name: 'android_no_cookies', client: 'android', useCookies: false },
    ];

    let lastError = null;

    for (const strategy of strategies) {
      try {
        console.log(`[stream] Trying strategy: ${strategy.name} for video ${id}`);
        
        const options = {
          dumpSingleJson: true,
          noWarnings: true,
          noCheckCertificates: true,
          preferFreeFormats: true,
          noCacheDir: true,
          format: 'best[ext=mp4]/best',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          extractorArgs: `youtube:player_client=${strategy.client}`,
        };

        if (strategy.useCookies) {
          options.cookies = cookiesPath;
        }

        const output = await youtubedl(videoUrl, options);

        console.log(`[stream] Success with strategy: ${strategy.name}`);

        return res.json({
          title: output.title,
          url: output.url,
          thumbnail: output.thumbnail,
          duration: output.duration,
          strategy: strategy.name,
          formats: (output.formats || []).map(f => ({
            format_id: f.format_id,
            ext: f.ext,
            resolution: f.resolution,
            url: f.url,
            filesize: f.filesize,
            vcodec: f.vcodec,
            acodec: f.acodec
          }))
        });
      } catch (err) {
        console.warn(`[stream] Strategy ${strategy.name} failed: ${err.message?.substring(0, 150)}`);
        lastError = err;
        continue;
      }
    }

    // All strategies failed
    const cookieStatus = getCookieStatus();
    const ytdlpVersion = getYtDlpVersion();
    
    res.status(500).json({
      error: 'All extraction strategies failed',
      lastError: lastError?.message || 'Unknown error',
      diagnostics: {
        ytdlpVersion,
        cookies: cookieStatus,
        hint: cookieStatus.loaded
          ? 'Cookies might be expired. Re-export from browser and restart container.'
          : 'No cookies.txt found. Export cookies from logged-in YouTube session.'
      }
    });
  } catch (error) {
    console.error('Error getting stream URL:', error);
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: update yt-dlp ─────────────────────────────────────────
app.post('/api/admin/update-ytdlp', async (req, res) => {
  try {
    const before = getYtDlpVersion();
    const output = execSync('pip3 install --no-cache-dir -U yt-dlp 2>&1', { encoding: 'utf-8' });
    const after = getYtDlpVersion();

    res.json({
      success: true,
      versionBefore: before,
      versionAfter: after,
      updated: before !== after,
      output: output.split('\n').slice(-3).join('\n').trim()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: check cookies status ──────────────────────────────────
app.get('/api/admin/cookies', (req, res) => {
  res.json(getCookieStatus());
});

app.listen(PORT, () => {
  console.log(`DarkTube Server v1.2.0 running on http://localhost:${PORT}`);
  console.log(`yt-dlp version: ${getYtDlpVersion()}`);
  const cs = getCookieStatus();
  console.log(`Cookies: ${cs.loaded ? `loaded (${cs.entries} entries, ${cs.reason})` : cs.reason}`);
});
