const { chromium } = require('playwright');
const path = require('path');

async function createPDF() {
  console.log('Starting PDF generation...');
  
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
  await page.waitForTimeout(3000);
  
  // Generate PDF with all slides
  const pdfPath = path.join(__dirname, 'AI-Research-Oversight-Framework.pdf');
  
  console.log('Generating PDF...');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    landscape: true,
    printBackground: true,
    preferCSSPageSize: false,
    margin: {
      top: '0',
      right: '0',
      bottom: '0', 
      left: '0'
    },
    scale: 0.8
  });
  
  console.log(`PDF saved to: ${pdfPath}`);
  
  await browser.close();
}

createPDF().catch(console.error);