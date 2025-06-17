# TikTok Downloader

Simple web application to download TikTok videos without watermark.

## Features

- Download TikTok HD videos without watermark
- Download separate audio (if available)
- Responsive design - works on mobile & desktop
- Fast processing dengan API backend
- Modern dark theme UI

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Production
npm start
```

## API Usage

```
GET /api/download?url=<tiktok_url>
```

## Supported TikTok URL Formats

- `tiktok.com/@username/video/123456`
- `vm.tiktok.com/shortcode`
- `vt.tiktok.com/shortcode`
- `m.tiktok.com/v/123456`

## Deploy

Ready to deploy to Vercel - just push to repository and connect to Vercel.

## Installation

```bash
# Clone repository
git clone https://github.com/111void/tiktok-dl.git
cd tiktok-downloader

# Install dependencies
npm install

# Run development server
npm run dev

# Or run production
npm start
```

Visit `http://localhost:3000` to view the application.