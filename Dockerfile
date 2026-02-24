# Use Node.js LTS as the base image
FROM node:20-slim

# Install dependencies for yt-dlp (Python) and ffmpeg
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    ffmpeg \
    curl \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp with EJS scripts and PO Token plugin via pip
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip3 install --no-cache-dir -U "yt-dlp[default]" bgutil-ytdlp-pot-provider

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Install yt-dlp global config (ensures --js-runtimes node is always used)
COPY yt-dlp.conf /etc/yt-dlp.conf

# Make startup script executable
RUN chmod +x start.sh

# Expose the port the app runs on
EXPOSE 3000

# Use startup script that auto-updates yt-dlp before starting
CMD [ "/bin/bash", "start.sh" ]
