import { NextRequest, NextResponse } from 'next/server';
import { generisiPdfKupoprodajaVozila } from '@/lib/pdf';
import { KupoprodajaVozilaSchema } from '@/sabloni/kupoprodaja-vozila/polja';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { podaci, pismo = 'latinica', vodeniZig = false } = body;

    const parsed = KupoprodajaVozilaSchema.safeParse(podaci);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Neispravni podaci', detalji: parsed.error.format() },
        { status: 400 }
      );
    }

    const pdfBuffer = await generisiPdfKupoprodajaVozila(parsed.data, {
      pismo,
      vodeniZig,
    });

    const filename = pismo === 'cirilica'
      ? 'Ugovor_o_kupoprodaji_vozila_cirilica.pdf'
      : 'Ugovor_o_kupoprodaji_vozila.pdf';

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(pdfBuffer.length),
      },
    });
  } catch (error: any) {
    console.error('Greška pri generisanju PDF-a:', error);
    return NextResponse.json(
      { error: 'Greška na serveru pri generisanju dokumenta' },
      { status: 500 }
    );
  }
}
