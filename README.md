# DarkTube Server - YouTube Wrapper API

[Indonesian](#bahasa-indonesia) | [English](#english)

---

## Bahasa Indonesia

**DarkTube Server** adalah API wrapper yang dirancang khusus sebagai backend untuk aplikasi homebrew **DarkTube** di console **Nintendo Switch (CFW)**. DarkTube sendiri adalah alternatif YouTube player untuk Switch yang berfokus pada performa dan kemudahan penggunaan. Server ini bertindak sebagai jembatan untuk memproses data YouTube dan mengekstrak direct stream URL agar bisa diputar langsung oleh aplikasi homebrew tersebut.

### Fitur Utama
- **🎥 YouTube Search**: Pencari video menggunakan YouTube Data API v3.
- **🔥 Trending Videos**: Mendapatkan daftar video populer berdasarkan wilayah.
- **🔗 Stream Extraction**: Mendapatkan direct stream link (mp4/webm) menggunakan `yt-dlp` (via `youtube-dl-exec`).
- **🚀 Deploy Ready**: Mendukung deployment langsung (Node.js) atau melalui Docker (rekomendasi VPS).

### Persiapan
Anda memerlukan **YouTube Data API Key**:
1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Buat project baru & Enable **YouTube Data API v3**.
3. Buat **API Key** pada menu Credentials.

### Instalasi & Deployment
1. **Konfigurasi**: Salin `.env.example` menjadi `.env`. Isi `YOUTUBE_API_KEY` dan `YOUTUBE_REGION_CODE` (contoh: `ID`, `US`, `JP`).
2. **Local**: `npm install` lalu `node index.js`.
3. **Docker (VPS)**: `docker-compose up -d --build`.

### Penanganan Bot Detection (Cookies)
Jika Anda menemui error "Sign in to confirm you're not a bot" di VPS:
1.  Install ekstensi "Get cookies.txt LOCALLY" (Chrome/Firefox).
2.  Buka YouTube dan login (jika perlu).
3.  Ekspor cookies untuk YouTube dalam format Netscape.
4.  Simpan sebagai `cookies.txt` di folder root project.
5.  Restart Docker: `docker-compose restart api`.

### API Endpoints
- `GET /`: Health check, server status, dan info versi.
- `GET /api/search?q=query`: Mencari list video.
- `GET /api/trending`: Mendapatkan video populer (Trending).
- `GET /api/video/:id`: Mengambil metadata detail video.
- `GET /api/stream?id=video_id`: Mengambil direct link stream video untuk diputar di player.

---

## English

**DarkTube Server** is an API wrapper specifically designed as the backend for the **DarkTube** homebrew application on **Nintendo Switch (CFW)** consoles. DarkTube is an alternative YouTube player for the Switch that focuses on performance and ease of use. This server acts as a bridge to process YouTube data and extract direct stream URLs so they can be played directly by the homebrew app.

### Key Features
- **🎥 YouTube Search**: Search for videos using YouTube Data API v3.
- **🔥 Trending Videos**: Get a list of popular videos by region.
- **🔗 Stream Extraction**: Get direct stream links (mp4/webm) using `yt-dlp` (via `youtube-dl-exec`).
- **🚀 Deploy Ready**: Supports direct deployment (Node.js) or via Docker (recommended for VPS).

### Preparation
You will need a **YouTube Data API Key**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project & Enable **YouTube Data API v3**.
3. Create an **API Key** under the Credentials menu.

### Installation & Deployment
1. **Configuration**: Copy `.env.example` to `.env`. Fill in your `YOUTUBE_API_KEY` and `YOUTUBE_REGION_CODE` (e.g., `ID`, `US`, `JP`).
2. **Local**: Run `npm install` followed by `node index.js`.
3. **Docker (VPS)**: Run `docker-compose up -d --build`.

### Handling Bot Detection (Cookies)
If you encounter "Sign in to confirm you're not a bot" error on VPS:
1.  Install "Get cookies.txt LOCALLY" extension (Chrome/Firefox).
2.  Open YouTube and log in (if necessary).
3.  Export cookies for YouTube in Netscape format.
4.  Save as `cookies.txt` in the project root folder.
5.  Restart Docker: `docker-compose restart api`.

### API Endpoints
- `GET /`: Health check, server status, and version info.
- `GET /api/search?q=query`: Search for videos.
- `GET /api/trending`: Get trending (popular) videos.
- `GET /api/video/:id`: Get video detail metadata.
- `GET /api/stream?id=video_id`: Get direct stream links for playback.

### Project Purpose
Backend support service for the **DarkTube** homebrew application (Alternative YouTube Player) on Nintendo Switch CFW consoles.

---
*Dibuat untuk kebutuhan personal dan edukasi. / Created for personal and educational purposes.*
