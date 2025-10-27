# Screenshot API

A serverless screenshot API using Puppeteer and Chromium.

## ⚠️ Vercel Deployment Issue

**This app does NOT work on Vercel** due to missing system libraries (`libnss3.so`). This is a known limitation of Vercel's serverless runtime with Puppeteer/Chromium.

## ✅ Recommended: Deploy to Render

1. Push this code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Render will auto-detect the `render.yaml` and deploy

**It will work immediately on Render!**

Alternatively, deploy to:
- Railway
- Fly.io
- DigitalOcean App Platform

## Local Development

```bash
npm install
node api/index.js
```

Visit: `http://localhost:3000/screenshot?url=https://example.com`

## API Usage

```
GET /screenshot?url=<URL>
```

**Parameters:**
- `url` (required) - The URL to screenshot

**Response:**
- Success: PNG image
- Error: JSON with error details

## Technical Details

**Error on Vercel:**
```
/tmp/chromium: error while loading shared libraries: libnss3.so: cannot open shared object file
```

**Root Cause:** Vercel's AWS Lambda runtime doesn't include required system libraries for Chromium.

**Tested & Failed on Vercel:**
- @sparticuz/chromium (versions 110, 119, 123, 126, 130)
- chrome-aws-lambda
- All chromium packages fail with the same library error

