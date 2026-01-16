import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { getDemo } from '@/data/swift-demos';
import { getDemoById } from '@/lib/database';
import { Demo } from '@/types/demo';

// Get demo from static files or database
async function getDemoData(demoId: string): Promise<Demo | null> {
  const staticDemo = getDemo(demoId);
  if (staticDemo) return staticDemo;
  const dbDemo = await getDemoById(demoId);
  return dbDemo;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const demoId = searchParams.get('demoId');

  if (!demoId) {
    return NextResponse.json({ error: 'Missing demoId' }, { status: 400 });
  }

  try {
    // Get the demo data
    const demoData = await getDemoData(demoId);
    if (!demoData) {
      return NextResponse.json({ error: 'Demo not found' }, { status: 404 });
    }

    // Read the pre-built standalone player files
    const distPath = path.join(process.cwd(), 'dist/standalone');
    const jsPath = path.join(distPath, 'player.iife.js');
    const cssPath = path.join(distPath, 'player.css');

    if (!fs.existsSync(jsPath) || !fs.existsSync(cssPath)) {
      return NextResponse.json(
        { error: 'Standalone player not built. Run npm run build:standalone first.' },
        { status: 500 }
      );
    }

    const playerJs = fs.readFileSync(jsPath, 'utf-8');
    const playerCss = fs.readFileSync(cssPath, 'utf-8');

    // Serialize demo data, handling Date objects
    const serializedDemo = JSON.stringify(demoData, (key, value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    });

    // Create the complete HTML file
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${demoData.title || 'Presentation'}</title>
  <style>
${playerCss}
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    // Inject demo data
    window.DEMO_DATA = ${serializedDemo};
  </script>
  <script>
${playerJs}
  </script>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${demoData.title.replace(/\s+/g, '-').toLowerCase()}-standalone.html"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to create export: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
