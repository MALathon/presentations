const { chromium } = require('playwright');
const path = require('path');

async function exportPDF() {
  console.log('Starting PDF export for Core Training Workshop...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-web-security', '--allow-file-access-from-files']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  // Navigate to the presentation in print mode
  const presentationUrl = `file://${path.resolve(__dirname, 'dist/index.html')}?exportMode=true&print-pdf`;
  console.log('Loading presentation from:', presentationUrl);

  await page.goto(presentationUrl, {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  // Wait for all content to load
  await page.waitForTimeout(5000);

  // Try to trigger print mode if available
  await page.evaluate(() => {
    // Force all slides to be visible
    const slides = document.querySelectorAll('.spectacle-slide');
    slides.forEach(slide => {
      slide.style.display = 'block';
      slide.style.position = 'relative';
      slide.style.pageBreakAfter = 'always';
    });
  });

  await page.waitForTimeout(2000);

  const pdfPath = path.join(__dirname, 'Core-Training-Workshop-AI.pdf');

  console.log('Generating PDF...');
  await page.pdf({
    path: pdfPath,
    format: 'Letter',
    landscape: true,
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: '0',
      right: '0',
      bottom: '0',
      left: '0'
    }
  });

  console.log(`PDF saved to: ${pdfPath}`);

  await browser.close();
  console.log('Done!');
}

exportPDF().catch(console.error);
