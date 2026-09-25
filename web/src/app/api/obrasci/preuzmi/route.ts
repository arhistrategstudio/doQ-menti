import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import { putanjaObrasca } from '@/lib/obrasci/putanja';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const izvor = searchParams.get('izvor'); // 'paragraf' | 'drzavni' | 'euprava'
  const kategorija = searchParams.get('kategorija') || '';
  const fajl = searchParams.get('fajl') || '';

  if (!fajl) {
    return NextResponse.json({ error: 'Fajl nije specificiran' }, { status: 400 });
  }

  const basePath = putanjaObrasca(izvor, kategorija, fajl);

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
