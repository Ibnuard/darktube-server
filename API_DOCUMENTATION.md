# DarkTube API Documentation

Dokumentasi lengkap untuk endpoint API DarkTube Server.

## Base URL
`http://localhost:3000` (atau IP VPS Anda)

---

## 0. Server Status / Health Check
Mengecek status server, versi, dan apakah cookies sudah terbaca.

- **URL**: `/`
- **Method**: `GET`
- **Response Example**:
  ```json
  {
    "name": "DarkTube Server",
    "version": "1.1.0",
    "status": "online",
    "health": "ok",
    "environment": "production",
    "region": "ID",
    "cookiesLoaded": true
  }
  ```

---

## 1. Search Videos
Mencari video berdasarkan kata kunci.

- **URL**: `/api/search`
- **Method**: `GET`
- **Query Parameters**:
  - `q` (string, required): Kata kunci pencarian.
  - `maxResults` (number, optional): Jumlah hasil (default: 10).
  - `pageToken` (string, optional): Token untuk halaman berikutnya.

- **Response Example**:
  ```json
  {
    "videos": [
      {
        "id": "dQw4w9WgXcQ",
        "title": "Rick Astley - Never Gonna Give You Up",
        "description": "...",
        "thumbnails": { "default": { "url": "...", "width": 120, "height": 90 }, ... },
        "channelTitle": "Rick Astley",
        "publishedAt": "2009-10-25T06:57:33Z"
      }
    ],
    "nextPageToken": "CAoQAA"
  }
  ```

---

## 2. Trending Videos
Mendapatkan video populer berdasarkan wilayah.

- **URL**: `/api/trending`
- **Method**: `GET`
- **Query Parameters**:
  - `regionCode` (string, optional): Kode negara (ISO 3166-1 alpha-2), contoh: `ID`, `US`, `JP`. Menggunakan default dari `.env` jika tidak diisi.
  - `maxResults` (number, optional): Jumlah hasil (default: 10).
  - `pageToken` (string, optional): Token untuk halaman berikutnya.

- **Response Example**:
  ```json
  {
    "videos": [
      {
        "id": "...",
        "title": "...",
        "statistics": {
          "viewCount": "1000000",
          "likeCount": "50000",
          "commentCount": "2000"
        }
      }
    ]
  }
  ```

---

## 3. Video Details
Mendapatkan detail lengkap dan statistik suatu video.

- **URL**: `/api/video/:id`
- **Method**: `GET`

- **Response Example**: Meta data lengkap dari YouTube API v3 (Snippet, Statistics, ContentDetails).

---

## 4. Get Stream URL
Mengekstrak direct URL video untuk diputar di player media.

- **URL**: `/api/stream`
- **Method**: `GET`
- **Query Parameters**:
  - `id` (string, required): ID video YouTube.

- **Response Example**:
  ```json
  {
    "title": "Video Title",
    "url": "https://rr5---sn-...",
    "thumbnail": "...",
    "duration": 212,
    "formats": [
      {
        "format_id": "18",
        "ext": "mp4",
        "resolution": "640x360",
        "url": "..."
      }
    ]
  }
  ```

---

## Error Codes
- `400 Bad Request`: Parameter kurang atau salah.
- `404 Not Found`: Video tidak ditemukan.
- `500 Internal Server Error`: Masalah pada server atau YouTube API.
