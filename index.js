require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const youtubedl = require('youtube-dl-exec');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const youtube = google.youtube({
  version: 'v3',
  auth: YOUTUBE_API_KEY
});

app.use(cors());
app.use(express.json());

// Endpoint to search for videos
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

// Endpoint to get trending videos
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

// Endpoint to get video details (including stats if needed)
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

// Endpoint to get stream URL via youtube-dl-exec
app.get('/api/stream', async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Video ID is required' });
    }

    const videoUrl = `https://www.youtube.com/watch?v=${id}`;
    
    // Using youtube-dl-exec to get format information
    const output = await youtubedl(videoUrl, {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificates: true,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
      // Note: we might want specific formats for Switch compatibility
      // For now, let's get the best combined format or a simple mp4
      format: 'best[ext=mp4]/best'
    });

    res.json({
      title: output.title,
      url: output.url, // This is the direct stream URL
      thumbnail: output.thumbnail,
      duration: output.duration,
      formats: output.formats.map(f => ({
        format_id: f.format_id,
        ext: f.ext,
        resolution: f.resolution,
        url: f.url
      }))
    });
  } catch (error) {
    console.error('Error getting stream URL:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`YouTube Wrapper API running on http://localhost:${PORT}`);
});
