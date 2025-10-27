const express = require('express');
const puppeteer = require('puppeteer');
const puppeteerCore = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

const app = express();

// Function to determine if running locally or in a serverless environment
const isLocal = () => {
    // Only return true if explicitly running locally (not on any cloud platform)
    return !process.env.VERCEL && 
           !process.env.AWS_LAMBDA_FUNCTION_NAME && 
           !process.env.VERCEL_ENV;
};

// Function to launch the browser
const launchBrowser = async () => {
    let browser;
    try {
        if (isLocal()) {
            console.log('Running locally. Using Puppeteer.');
            browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
        } else {
            console.log('Running in a serverless environment. Using Chromium.');
            console.log('Environment check - VERCEL:', process.env.VERCEL, 'VERCEL_ENV:', process.env.VERCEL_ENV);
            
            browser = await puppeteerCore.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath({
                    cacheDir: '/tmp'
                }),
                headless: chromium.headless,
                ignoreHTTPSErrors: true,
            });
        }
        console.log('Browser launched successfully');
        return browser;
    } catch (error) {
        console.error('Error launching browser:', error);
        throw new Error('Browser initialization failed');
    }
};

// Endpoint to capture screenshots
app.get('/screenshot', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    let browser;
    let page;
    try {
        browser = await launchBrowser();
        page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 720 });

        console.log(`Navigating to: ${url}`);

        // Use a shorter timeout for page.goto
        const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }); // 30 seconds timeout

        if (!response || !response.ok()) {
            throw new Error(`Failed to load page, status code: ${response ? response.status() : 'unknown'}`);
        }

        // Set a timeout for taking the screenshot
        const screenshot = await Promise.race([
            page.screenshot({ encoding: 'binary' }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Screenshot timeout')), 30000)), // 30 seconds timeout
        ]);

        res.set('Content-Type', 'image/png');
        res.end(screenshot, 'binary');
    } catch (error) {
        console.error(`Error taking screenshot: ${error.message}`);
        res.status(500).json({ error: 'Failed to take screenshot', details: error.message });
    } finally {
        if (page) await page.close();
        if (browser) await browser.close();
    }
});

// Export the Express app for Vercel
module.exports = app;
