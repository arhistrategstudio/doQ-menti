import { NextRequest, NextResponse } from 'next/server';
import { generisiUniverzalniObrazacPdf } from '@/lib/pdf/univerzalni';

export async function POST(req: NextRequest) {
  try {
    const { nazivObrasca, kategorija, podaci, pismo = 'latinica' } = await req.json();

    const pdfBuffer = await generisiUniverzalniObrazacPdf(
      nazivObrasca || 'Obrazac',
      kategorija || 'Opšte',
      podaci || {},
      { pismo }
    );

    const safeFilename = `${(nazivObrasca || 'Obrazac').replace(/[^a-zA-Z0-9_\u0400-\u04FF]/g, '_').slice(0, 40)}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
        'Content-Length': String(pdfBuffer.length),
      },
    });
  } catch (error) {
    console.error('Greška pri generisanju univerzalnog PDF-a:', error);
    return NextResponse.json({ error: 'Greška pri generisanju obrasca' }, { status: 500 });
  }
}
