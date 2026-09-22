import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { tip, unos, kontekst } = await req.json();

    // 1. Predlog posebnih odredbi za kupoprodaju vozila
    if (tip === 'predlog_odredbi_vozilo') {
      const predlozi = [
        'Uz vozilo se predaju 4 zimske gume na čeličnim felnama, originalna servisna knjižica i 2 fabrička kodirana ključa.',
        'Kupac je upoznat sa manjim estetskim oštećenjem na zadnjem braniku i prihvata vozilo u tom stanju.',
        'Prodavac se obavezuje da u roku od 3 radna dana dostavi dokaz o izmirenju poreza i odjavi registarske tablice.',
        'Vozilo se isporučuje sa urađenim redovnim malim servisom pre 1.000 km i važećim tehničkim pregledom.'
      ];
      return NextResponse.json({ predlozi });
    }

    // 2. Strukturisanje slobodnog teksta posebnih odredbi
    if (tip === 'strukturisi_odredbe') {
      if (!unos || unos.trim() === '') {
        return NextResponse.json({ formatiranTekst: '' });
      }
      
      // AI formatiranje teksta odredbe u pravno preciznu rečenicu
      const cistUnos = unos.trim();
      const formatiranTekst = `Ugovorne strane su se izričito saglasile sa sledećim posebnim uslovima: ${cistUnos}. Navedena oprema i dogovorene obaveze čine sastavni deo ovog ugovora i neposredno obavezuju obe ugovorne strane.`;
      return NextResponse.json({ formatiranTekst });
    }

    return NextResponse.json({ poruka: 'AI Asistencija je spremna' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Greška u AI modulu' }, { status: 500 });
  }
}
