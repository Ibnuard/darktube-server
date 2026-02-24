#!/bin/bash
echo "========================================="
echo "  DarkTube Server - Starting Up"
echo "========================================="

# Auto-update yt-dlp to latest version
echo "[*] Updating yt-dlp to latest version..."
pip3 install --no-cache-dir -U yt-dlp 2>&1 | tail -1
echo "[*] yt-dlp version: $(yt-dlp --version)"

# Validate cookies file
if [ -f "/usr/src/app/cookies.txt" ]; then
    COOKIE_SIZE=$(wc -c < /usr/src/app/cookies.txt)
    COOKIE_LINES=$(wc -l < /usr/src/app/cookies.txt)
    echo "[*] cookies.txt found (${COOKIE_SIZE} bytes, ${COOKIE_LINES} lines)"
    
    # Check if cookies file has actual content (not just headers)
    if [ "$COOKIE_SIZE" -lt 100 ]; then
        echo "[!] WARNING: cookies.txt seems too small, might be empty or invalid"
    fi
else
    echo "[!] WARNING: cookies.txt not found - YouTube may block requests"
fi

echo "[*] Starting Node.js server..."
exec node index.js
