const { chromium } = require('playwright');
const path = require('path');
const http = require('http');
const fs = require('fs');
const mime = require('mime-types');

// Simple static file server
function startServer(port) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let filePath = path.join(__dirname, 'dist', req.url === '/' ? 'index.html' : req.url);
      
      // Handle the base URL for assets
      if (req.url.startsWith('/presentations/')) {
        filePath = path.join(__dirname, 'dist', req.url.replace('/presentations/NCI2025-AI-Oversight_Framework/dist/', ''));
      }
      
      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        
        const mimeType = mime.lookup(filePath) || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(content);
      });
    });
    
    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function createPDF() {
  console.log('Starting PDF generation with local server...');
  
  // Start local server
  const port = 8765;
  const server = await startServer(port);
  
  const browser = await chromium.launch({ 
    headless: true
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  // Navigate to the presentation via local server
  const presentationUrl = `http://localhost:${port}/`;
  console.log('Loading presentation from:', presentationUrl);
  await page.goto(presentationUrl, { waitUntil: 'networkidle' });
  
  // Wait for presentation to fully load
  await page.waitForTimeout(3000);
  
  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'pdf-slides');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }
  
  const slides = [];
  
  // Capture each slide (0-21 = 22 slides total)
  for (let i = 0; i <= 21; i++) {
    console.log(`Capturing slide ${i + 1} of 22...`);
    
    // Navigate to specific slide
    await page.goto(`http://localhost:${port}/?slideIndex=${i}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000); // Wait for animations
    
    // Take screenshot
    const screenshotPath = path.join(screenshotsDir, `slide-${String(i).padStart(2, '0')}.png`);
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: false,
      type: 'png'
    });
    
    slides.push(screenshotPath);
  }
  
  console.log('All slides captured. Creating PDF...');
  
  // Now create a PDF by navigating to each slide and printing
  const pdfPages = [];
  
  for (let i = 0; i <= 21; i++) {
    await page.goto(`http://localhost:${port}/?slideIndex=${i}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    
    pdfPages.push(pdfBuffer);
  }
  
  // For now, just save the last complete render
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Force all slides to be visible for PDF
  await page.evaluate(() => {
    // Get all slide elements
    const slides = document.querySelectorAll('[data-testid*="slide"]');
    const container = document.querySelector('#root > div > div');
    
    if (container) {
      // Remove transform that positions slides
      container.style.transform = 'none';
      container.style.display = 'block';
      
      // Make each slide visible and position them vertically
      let yOffset = 0;
      slides.forEach((slide, index) => {
        slide.style.position = 'absolute';
        slide.style.display = 'block';
        slide.style.visibility = 'visible';
        slide.style.opacity = '1';
        slide.style.top = `${yOffset}px`;
        slide.style.left = '0';
        slide.style.width = '1920px';
        slide.style.height = '1080px';
        slide.style.pageBreakAfter = 'always';
        slide.style.pageBreakInside = 'avoid';
        yOffset += 1080;
      });
      
      // Set container height to accommodate all slides
      container.style.height = `${yOffset}px`;
      document.body.style.height = `${yOffset}px`;
    }
  });
  
  await page.waitForTimeout(2000);
  
  const pdfPath = path.join(__dirname, 'AI-Research-Oversight-Framework.pdf');
  
  console.log('Generating final PDF...');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    landscape: true,
    printBackground: true,
    preferCSSPageSize: false,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    scale: 0.5
  });
  
  console.log(`PDF saved to: ${pdfPath}`);
  
  // Clean up
  server.close();
  await browser.close();
  
  // Clean up screenshots
  for (const slide of slides) {
    fs.unlinkSync(slide);
  }
  fs.rmdirSync(screenshotsDir);
  
  console.log('Done!');
}

createPDF().catch(console.error);