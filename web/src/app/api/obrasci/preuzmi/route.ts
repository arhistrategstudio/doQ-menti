import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const izvor = searchParams.get('izvor'); // 'paragraf' | 'drzavni' | 'euprava'
  const kategorija = searchParams.get('kategorija') || '';
  const fajl = searchParams.get('fajl') || '';

  if (!fajl) {
    return NextResponse.json({ error: 'Fajl nije specificiran' }, { status: 400 });
  }

  let basePath = '';
  if (izvor === 'paragraf') {
    basePath = path.resolve(process.cwd(), '..', 'docs', 'obrasci-paragraf', kategorija, fajl);
  } else if (izvor === 'drzavni') {
    basePath = path.resolve(process.cwd(), '..', 'docs', 'obrasci-mup-drzavni', kategorija, fajl);
  } else if (izvor === 'euprava') {
    basePath = path.resolve(process.cwd(), '..', 'docs', 'euprava', 'obrasci', fajl);
  }

  if (basePath && fs.existsSync(basePath)) {
    const fileBuffer = fs.readFileSync(basePath);
    const contentType = fajl.endsWith('.pdf')
      ? 'application/pdf'
      : fajl.endsWith('.docx')
      ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      : fajl.endsWith('.doc')
      ? 'application/msword'
      : fajl.endsWith('.xls')
      ? 'application/vnd.ms-excel'
      : 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fajl)}"`,
      },
    });
  }

  return NextResponse.json({ error: 'Fajl nije pronađen na serveru' }, { status: 404 });
}
