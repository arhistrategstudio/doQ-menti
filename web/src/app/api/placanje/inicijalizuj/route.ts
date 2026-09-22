import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { metod, dokument, iznosRsd, podaci } = await req.json();

    const porudzbinaId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    if (metod === 'ips_qr') {
      // NBS IPS QR kod standard (K:PR|V:01|C:1|R:...)
      // Primer generisanog QR payload-a prema NBS IPS standardu
      const racunPrimaoca = '160000000123456789';
      const nazivPrimaoca = 'doQ-menti d.o.o. Beograd';
      const qrNbsString = `K:PR|V:01|C:1|R:${racunPrimaoca}|N:${nazivPrimaoca}|I:RSD${iznosRsd},00|SF:289|S:Kupovina dokumenta ${dokument}|RO:${porudzbinaId}`;

      return NextResponse.json({
        porudzbinaId,
        metod: 'ips_qr',
        iznosRsd,
        qrNbsString,
        instrukcije: 'Skenirajte IPS QR kod iz aplikacije Vaše banke (m-banking) ili kliknite na dugme za direktno otvaranje.'
      });
    }

    if (metod === 'kartica') {
      return NextResponse.json({
        porudzbinaId,
        metod: 'kartica',
        iznosRsd,
        status: 'redirect_gateway',
        gatewayUrl: `/placanje/kartica-simulacija?order=${porudzbinaId}&amount=${iznosRsd}`
      });
    }

    if (metod === 'sms') {
      const smsBroj = '1399';
      const smsTekst = `DOK ${porudzbinaId.slice(-6)}`;
      return NextResponse.json({
        porudzbinaId,
        metod: 'sms',
        iznosRsd,
        smsBroj,
        smsTekst,
        instrukcije: `Pošaljite SMS sa tekstom "${smsTekst}" na broj ${smsBroj}. Cena poruke je ${iznosRsd} RSD + cena osnovnog SMS-a.`
      });
    }

    return NextResponse.json({ error: 'Nepoznat metod plaćanja' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Greška pri obradi plaćanja' }, { status: 500 });
  }
}
