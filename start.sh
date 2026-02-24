#!/bin/bash
echo "========================================="
echo "  DarkTube Server - Starting Up"
echo "========================================="

# Auto-update yt-dlp and PO Token plugin to latest version
echo "[*] Updating yt-dlp and PO Token plugin..."
pip3 install --no-cache-dir -U yt-dlp bgutil-ytdlp-pot-provider 2>&1 | tail -2
echo "[*] yt-dlp version: $(yt-dlp --version)"

# Validate cookies file
if [ -f "/usr/src/app/cookies.txt" ]; then
    COOKIE_SIZE=$(wc -c < /usr/src/app/cookies.txt)
    COOKIE_LINES=$(wc -l < /usr/src/app/cookies.txt)
    echo "[*] cookies.txt found (${COOKIE_SIZE} bytes, ${COOKIE_LINES} lines)"
    
    if [ "$COOKIE_SIZE" -lt 100 ]; then
        echo "[!] WARNING: cookies.txt seems too small, might be empty or invalid"
    fi
else
    echo "[!] WARNING: cookies.txt not found - YouTube may block requests"
fi

# Check PO Token provider connectivity
POT_URL="${POT_PROVIDER_URL:-http://pot-provider:4416}"
echo "[*] Checking PO Token provider at ${POT_URL}..."
for i in 1 2 3 4 5; do
    if curl -s --max-time 3 "${POT_URL}" > /dev/null 2>&1; then
        echo "[*] PO Token provider is reachable"
        break
    fi
    echo "[*] Waiting for PO Token provider... (attempt $i/5)"
    sleep 3
done

echo "[*] Starting Node.js server..."
exec node index.js
