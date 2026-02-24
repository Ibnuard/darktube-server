# DarkTube Server - YouTube Wrapper API

[Indonesian](#bahasa-indonesia) | [English](#english)

---

## Bahasa Indonesia

**DarkTube Server** adalah API wrapper yang dirancang khusus sebagai backend untuk aplikasi homebrew **DarkTube** di console **Nintendo Switch (CFW)**. DarkTube sendiri adalah alternatif YouTube player untuk Switch yang berfokus pada performa dan kemudahan penggunaan. Server ini bertindak sebagai jembatan untuk memproses data YouTube dan mengekstrak direct stream URL agar bisa diputar langsung oleh aplikasi homebrew tersebut.

### Fitur Utama
- **🎥 YouTube Search**: Pencari video menggunakan YouTube Data API v3.
- **🔗 Stream Extraction**: Mendapatkan direct stream link (mp4/webm) menggunakan `yt-dlp` (via `youtube-dl-exec`).
- **🚀 Deploy Ready**: Mendukung deployment langsung (Node.js) atau melalui Docker (rekomendasi VPS).

### Persiapan
Anda memerlukan **YouTube Data API Key**:
1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Buat project baru & Enable **YouTube Data API v3**.
3. Buat **API Key** pada menu Credentials.

### Instalasi & Deployment
1. **Konfigurasi**: Salin `.env.example` menjadi `.env` dan isi `YOUTUBE_API_KEY`.
2. **Local**: `npm install` lalu `node index.js`.
3. **Docker (VPS)**: `docker-compose up -d --build`.

### Tujuan Project
Layanan backend pendukung untuk aplikasi homebrew **DarkTube** (YouTube Player Alternative) pada console Nintendo Switch CFW.

---

## English

**DarkTube Server** is an API wrapper specifically designed as the backend for the **DarkTube** homebrew application on **Nintendo Switch (CFW)** consoles. DarkTube is an alternative YouTube player for the Switch that focuses on performance and ease of use. This server acts as a bridge to process YouTube data and extract direct stream URLs so they can be played directly by the homebrew app.

### Key Features
- **🎥 YouTube Search**: Search for videos using YouTube Data API v3.
- **🔗 Stream Extraction**: Get direct stream links (mp4/webm) using `yt-dlp` (via `youtube-dl-exec`).
- **🚀 Deploy Ready**: Supports direct deployment (Node.js) or via Docker (recommended for VPS).

### Preparation
You will need a **YouTube Data API Key**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project & Enable **YouTube Data API v3**.
3. Create an **API Key** under the Credentials menu.

### Installation & Deployment
1. **Configuration**: Copy `.env.example` to `.env` and fill in your `YOUTUBE_API_KEY`.
2. **Local**: Run `npm install` followed by `node index.js`.
3. **Docker (VPS)**: Run `docker-compose up -d --build`.

### Project Purpose
Backend support service for the **DarkTube** homebrew application (Alternative YouTube Player) on Nintendo Switch CFW consoles.

---
*Dibuat untuk kebutuhan personal dan edukasi. / Created for personal and educational purposes.*
