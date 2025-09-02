const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

async function createPDF() {
  console.log('Starting PDF generation with individual slides...');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--disable-web-security']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  // Navigate to the presentation
  const presentationUrl = `file://${path.resolve(__dirname, 'dist/index.html')}`;
  console.log('Loading presentation from:', presentationUrl);
  await page.goto(presentationUrl, { waitUntil: 'networkidle' });
  
  // Wait for presentation to fully load
  await page.waitForTimeout(2000);
  
  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'pdf-screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }
  
  // Total number of slides
  const totalSlides = 22; // 0-21 (22 slides total)
  
  console.log('Capturing slides...');
  
  // Capture each slide
  for (let i = 0; i <= 21; i++) {
    // Navigate to specific slide
    await page.goto(`${presentationUrl}?slideIndex=${i}&slideId=${i}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500); // Wait for animations
    
    // Take screenshot
    const screenshotPath = path.join(screenshotsDir, `slide-${String(i).padStart(2, '0')}.png`);
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: false,
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });
    
    console.log(`Captured slide ${i + 1} of ${totalSlides}`);
  }
  
  console.log('All slides captured. Creating PDF...');
  
  // Create PDF from screenshots
  const doc = new PDFDocument({
    size: [1920, 1080],
    margin: 0
  });
  
  const pdfPath = path.join(__dirname, 'AI-Research-Oversight-Framework.pdf');
  const stream = fs.createWriteStream(pdfPath);
  doc.pipe(stream);
  
  // Add each screenshot to PDF
  for (let i = 0; i <= 21; i++) {
    const screenshotPath = path.join(screenshotsDir, `slide-${String(i).padStart(2, '0')}.png`);
    
    if (i > 0) {
      doc.addPage();
    }
    
    doc.image(screenshotPath, 0, 0, {
      width: 1920,
      height: 1080,
      align: 'center',
      valign: 'center'
    });
  }
  
  doc.end();
  
  await new Promise(resolve => stream.on('finish', resolve));
  
  console.log(`PDF saved to: ${pdfPath}`);
  
  // Clean up screenshots
  console.log('Cleaning up screenshots...');
  for (let i = 0; i <= 21; i++) {
    const screenshotPath = path.join(screenshotsDir, `slide-${String(i).padStart(2, '0')}.png`);
    fs.unlinkSync(screenshotPath);
  }
  fs.rmdirSync(screenshotsDir);
  
  await browser.close();
  console.log('Done!');
}

createPDF().catch(console.error);