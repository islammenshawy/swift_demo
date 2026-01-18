import PptxGenJS from 'pptxgenjs';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, '..', 'exports');

// Theme colors
const THEME = {
  bgPrimary: '0A1628',
  bgSecondary: '0F1F35',
  accentGold: 'C9A227',
  accentCyan: '00D4FF',
  textPrimary: 'FFFFFF',
  textSecondary: 'B4C7E7',
  textMuted: '6B7C93',
  green: '22C55E',
};

// Speaking points for the Evalio engineering score overview
const speakingPoints = [
  'Unified scoring from JIRA, GitHub, Confluence data',
  'Role-based weights — seniors vs juniors evaluated differently',
  'Team benchmarking removes apples-to-oranges comparisons',
  'AI explains the score — no more "How do I justify this rating?"',
  'Managers get objective data, engineers get fair evaluations',
];

// Image labels for the 4 screenshots
const imageLabels = [
  'Multi-Framework Scoring',
  'Score Calculation',
  'Level-Adjusted Weights',
  'AI-Powered Intelligence',
];

async function createEvalioSummarySlide(imagePaths = null) {
  console.log('Image paths received:', imagePaths);
  if (imagePaths) {
    imagePaths.forEach((p, i) => {
      console.log(`  Image ${i + 1}: ${p} - exists: ${existsSync(p)}`);
    });
  }

  const pres = new PptxGenJS();

  // Set presentation properties
  pres.author = 'Evalio';
  pres.title = 'Evalio - Engineering Score Overview';
  pres.subject = 'AI-powered engineering performance evaluation';

  // Set slide size (16:9)
  pres.defineLayout({ name: 'WIDE', width: 13.33, height: 7.5 });
  pres.layout = 'WIDE';

  const slide = pres.addSlide();
  slide.background = { color: THEME.bgPrimary };

  // Title
  slide.addText('Evalio — Engineering Score', {
    x: 0.5,
    y: 0.3,
    w: 12.33,
    h: 0.6,
    fontSize: 32,
    bold: true,
    color: THEME.textPrimary,
    fontFace: 'Arial',
  });

  // Subtitle
  slide.addText('Objective performance measurement powered by data', {
    x: 0.5,
    y: 0.85,
    w: 12.33,
    h: 0.4,
    fontSize: 16,
    color: THEME.accentGold,
    fontFace: 'Arial',
  });

  // 2x2 Image grid (left side) - with placeholders or actual images
  const imgWidth = 3.8;
  const imgHeight = 2.3;
  const imgStartX = 0.5;
  const imgStartY = 1.5;
  const imgGapX = 0.3;
  const imgGapY = 0.3;

  const imagePositions = [
    { x: imgStartX, y: imgStartY },
    { x: imgStartX + imgWidth + imgGapX, y: imgStartY },
    { x: imgStartX, y: imgStartY + imgHeight + imgGapY },
    { x: imgStartX + imgWidth + imgGapX, y: imgStartY + imgHeight + imgGapY },
  ];

  imagePositions.forEach((pos, i) => {
    // Image placeholder box
    slide.addShape('rect', {
      x: pos.x,
      y: pos.y,
      w: imgWidth,
      h: imgHeight,
      fill: { color: THEME.bgSecondary },
      line: { color: THEME.accentCyan, pt: 2 },
      rectRadius: 0.1,
    });

    // If we have actual images, add them
    if (imagePaths && imagePaths[i] && existsSync(imagePaths[i])) {
      slide.addImage({
        path: imagePaths[i],
        x: pos.x + 0.05,
        y: pos.y + 0.05,
        w: imgWidth - 0.1,
        h: imgHeight - 0.35,
      });
    } else {
      // Placeholder text
      slide.addText(`Screenshot ${i + 1}`, {
        x: pos.x,
        y: pos.y + imgHeight / 2 - 0.4,
        w: imgWidth,
        h: 0.5,
        fontSize: 14,
        color: THEME.textMuted,
        fontFace: 'Arial',
        align: 'center',
      });
      slide.addText('(Add image here)', {
        x: pos.x,
        y: pos.y + imgHeight / 2,
        w: imgWidth,
        h: 0.3,
        fontSize: 10,
        color: THEME.textMuted,
        fontFace: 'Arial',
        align: 'center',
      });
    }

    // Image label
    slide.addText(imageLabels[i], {
      x: pos.x,
      y: pos.y + imgHeight - 0.35,
      w: imgWidth,
      h: 0.3,
      fontSize: 11,
      bold: true,
      color: THEME.accentCyan,
      fontFace: 'Arial',
      align: 'center',
      fill: { color: THEME.bgSecondary },
    });
  });

  // Speaking points (right side)
  const pointsX = 8.5;
  const pointsY = 1.5;
  const pointsW = 4.5;

  // Points header
  slide.addText('Key Takeaways', {
    x: pointsX,
    y: pointsY,
    w: pointsW,
    h: 0.5,
    fontSize: 18,
    bold: true,
    color: THEME.accentGold,
    fontFace: 'Arial',
  });

  // Speaking points with numbered bullets
  speakingPoints.forEach((point, i) => {
    const yPos = pointsY + 0.7 + (i * 0.95);

    // Number circle
    slide.addShape('ellipse', {
      x: pointsX,
      y: yPos,
      w: 0.35,
      h: 0.35,
      fill: { color: THEME.accentCyan },
    });

    slide.addText(`${i + 1}`, {
      x: pointsX,
      y: yPos,
      w: 0.35,
      h: 0.35,
      fontSize: 12,
      bold: true,
      color: THEME.bgPrimary,
      fontFace: 'Arial',
      align: 'center',
      valign: 'middle',
    });

    // Point text
    slide.addText(point, {
      x: pointsX + 0.5,
      y: yPos,
      w: pointsW - 0.5,
      h: 0.8,
      fontSize: 13,
      color: THEME.textSecondary,
      fontFace: 'Arial',
      valign: 'top',
    });
  });

  // Bottom tagline
  slide.addText('Objective data. Fair evaluations. No more guesswork.', {
    x: 0.5,
    y: 6.9,
    w: 12.33,
    h: 0.4,
    fontSize: 14,
    italic: true,
    color: THEME.textMuted,
    fontFace: 'Arial',
    align: 'center',
  });

  // Ensure output directory exists
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Save the presentation
  const outputPath = join(outputDir, 'evalio-engineering-score.pptx');
  const data = await pres.write({ outputType: 'nodebuffer' });
  writeFileSync(outputPath, data);

  console.log(`✓ Created: ${outputPath}`);
  console.log('\nTo add screenshots:');
  console.log('1. Run the demo at http://localhost:3000/demo/evalio-demo');
  console.log('2. Navigate to slides 5-8 and take screenshots');
  console.log('3. Open the PPTX and replace placeholders with your screenshots');
  console.log('\nOr provide image paths as arguments:');
  console.log('  node scripts/create-evalio-summary.mjs img1.png img2.png img3.png img4.png');

  return outputPath;
}

// Run with optional image paths
const imagePaths = process.argv.slice(2);
createEvalioSummarySlide(imagePaths.length === 4 ? imagePaths : null);
