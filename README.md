# Screenshot API

A serverless screenshot API using Puppeteer and Chromium.

## Current Issue: Vercel Deployment

**Status:** ⚠️ Not working on Vercel due to missing system libraries

### Error
```
/tmp/chromium: error while loading shared libraries: libnss3.so: cannot open shared object file: No such file or directory
```

### Root Cause
Vercel's serverless runtime (AWS Lambda) doesn't include the `libnss3` and other required system libraries that Chromium needs. This is a known limitation across multiple chromium packages:
- `@sparticuz/chromium` (all versions tested: 110, 119, 123, 126, 130)
- `chrome-aws-lambda`

### Solutions

#### Option 1: Use a Different Platform ✅ Recommended
Deploy to platforms with better Puppeteer support:
- **Railway** - Works out of the box
- **Render** - Works out of the box  
- **Fly.io** - Works out of the box
- **AWS Lambda with Lambda Layers** - Requires custom layer setup

#### Option 2: Use an External Screenshot Service
Replace Puppeteer with a third-party API:
- [Urlbox](https://www.urlbox.io/)
- [ApiFlash](https://apiflash.com/)
- [ScreenshotAPI](https://screenshotapi.net/)
- [Microlink](https://microlink.io/)

#### Option 3: Use Playwright (Alternative)
Playwright has better serverless support, but may also face similar issues on Vercel.

## Local Development

Works perfectly on local machine:

```bash
npm install
node api/index.js
```

Then visit: `http://localhost:3000/screenshot?url=https://example.com`

## API Usage

```
GET /screenshot?url=<URL>
```

**Parameters:**
- `url` (required) - The URL to screenshot

**Response:**
- Success: PNG image
- Error: JSON with error details

## Package Versions Tested

| Package | Version | Result on Vercel |
|---------|---------|------------------|
| @sparticuz/chromium | 130.0.0 | ❌ libnss3.so error |
| @sparticuz/chromium | 126.0.0 | ❌ libnss3.so error |
| @sparticuz/chromium | 123.0.1 | ❌ libnss3.so error |
| @sparticuz/chromium | 119.0.2 | ❌ libnss3.so error |
| @sparticuz/chromium | 110.0.0 | ❌ libnss3.so error |
| chrome-aws-lambda | 10.1.0 | ❌ Browser not found |

## Recommendation

**Deploy to Railway or Render instead of Vercel for Puppeteer-based applications.**
