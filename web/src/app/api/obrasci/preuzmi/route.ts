import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import katalog from '@/data/katalog-obrazaca.json';

type Kat = { name: string; items: { file: string; source: string }[] };

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const izvor = searchParams.get('izvor'); // 'paragraf' | 'drzavni' | 'euprava'
  const kategorija = searchParams.get('kategorija') || '';
  const fajl = searchParams.get('fajl') || '';

  if (!fajl) {
    return NextResponse.json({ error: 'Fajl nije specificiran' }, { status: 400 });
  }

  // Dozvoljeni su samo fajlovi iz kataloga (sprečava čitanje proizvoljnih fajlova sa servera)
  const uKatalogu = (katalog as Kat[]).some(
    (k) => (izvor === 'euprava' || k.name === kategorija) && k.items.some((i) => i.source === izvor && i.file === fajl)
  );
  if (!uKatalogu || fajl.includes('/') || fajl.includes('\\') || kategorija.includes('/') || kategorija.includes('\\') || kategorija.includes('..')) {
    return NextResponse.json({ error: 'Fajl nije pronađen na serveru' }, { status: 404 });
  }

  const docsDir = path.resolve(process.cwd(), '..', 'docs');
  let basePath = '';
  if (izvor === 'paragraf') {
    basePath = path.resolve(docsDir, 'obrasci-paragraf', kategorija, fajl);
  } else if (izvor === 'drzavni') {
    basePath = path.resolve(docsDir, 'obrasci-mup-drzavni', kategorija, fajl);
  } else if (izvor === 'euprava') {
    basePath = path.resolve(docsDir, 'euprava', 'obrasci', fajl);
  }
  if (!basePath.startsWith(docsDir + path.sep)) basePath = '';

  const isDownload = searchParams.get('download') === '1' || searchParams.get('download') === 'true';

  if (basePath && fs.existsSync(basePath)) {
    const fileBuffer = fs.readFileSync(basePath);
    const contentType = fajl.endsWith('.pdf')
      ? 'application/pdf'
      : fajl.endsWith('.docx')
      ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      : fajl.endsWith('.doc')
      ? 'application/msword'
      : fajl.endsWith('.xlsx')
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : fajl.endsWith('.xls')
      ? 'application/vnd.ms-excel'
      : 'application/octet-stream';

    const disposition = isDownload ? 'attachment' : 'inline';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `${disposition}; filename="${encodeURIComponent(fajl)}"`,
      },
    });
  }

  return NextResponse.json({ error: 'Fajl nije pronađen na serveru' }, { status: 404 });
}
