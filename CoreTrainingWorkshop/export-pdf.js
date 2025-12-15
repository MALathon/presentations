const { chromium } = require('playwright');
const { PDFDocument } = require('pdf-lib');
const path = require('path');
const fs = require('fs');

const TOTAL_SLIDES = 9;
const BASE_URL = 'https://malathon.github.io/presentations/CoreTrainingWorkshop/dist';

async function exportPDF() {
  console.log('Starting PDF export for Core Training Workshop...');
  console.log('Fetching slides from GitHub Pages...');

  const browser = await chromium.launch({
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  console.log('Loading presentation from:', BASE_URL);

  await page.goto(BASE_URL, {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  // Wait for initial load
  await page.waitForTimeout(5000);

  // Create merged PDF document
  const mergedPdf = await PDFDocument.create();

  // Capture each slide
  for (let i = 0; i < TOTAL_SLIDES; i++) {
    console.log(`Capturing slide ${i + 1}/${TOTAL_SLIDES}...`);

    // Navigate to specific slide
    await page.goto(`${BASE_URL}?slideIndex=${i}`, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for animations
    await page.waitForTimeout(2000);

    // Generate PDF for this slide
    const slidePdfBytes = await page.pdf({
      width: '1920px',
      height: '1080px',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    console.log(`  Slide ${i + 1} PDF size: ${(slidePdfBytes.length / 1024).toFixed(1)} KB`);

    // Load and merge into main PDF
    const slidePdf = await PDFDocument.load(slidePdfBytes);
    const [copiedPage] = await mergedPdf.copyPages(slidePdf, [0]);
    mergedPdf.addPage(copiedPage);
  }

  console.log('All slides captured. Saving merged PDF...');

  const pdfPath = path.join(__dirname, 'Core-Training-Workshop-AI.pdf');
  const pdfBytes = await mergedPdf.save();
  fs.writeFileSync(pdfPath, pdfBytes);

  console.log(`PDF saved to: ${pdfPath}`);

  await browser.close();

  // Check file size
  const stats = fs.statSync(pdfPath);
  console.log(`PDF file size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  console.log('Done!');
}

exportPDF().catch(console.error);
