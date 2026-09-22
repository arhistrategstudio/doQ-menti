import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { tip, unos, kontekst } = await req.json();

    // 1. Predlog posebnih odredbi (prilagodjen po dokumentu)
    if (tip === 'predlog_odredbi') {
      const nazivDokumenta = (kontekst || '').toLowerCase();
      let predlozi = [];

      if (nazivDokumenta.includes('vozil') || nazivDokumenta.includes('auto')) {
        predlozi = [
          'Uz vozilo se predaju 4 zimske gume, originalna servisna knjižica i 2 fabrička ključa.',
          'Kupac je upoznat sa manjim oštećenjem i prihvata vozilo u tom stanju.',
          'Prodavac se obavezuje da u roku od 3 radna dana izmiri porez i odjavi tablice.',
        ];
      } else if (nazivDokumenta.includes('zakup') || nazivDokumenta.includes('stan')) {
        predlozi = [
          'Zakupac se obavezuje da plaća komunalije najkasnije do 15. u mesecu.',
          'Depozit u visini jedne mesečne zakupnine će biti vraćen po isteku ugovora ukoliko nema oštećenja.',
        ];
      } else if (nazivDokumenta.includes('rad') || nazivDokumenta.includes('zaposlen')) {
        predlozi = [
          'Zaposleni ima pravo na godišnji odmor u trajanju od najmanje 20 radnih dana.',
          'Probni rad se ugovara u trajanju od maksimalno 3 meseca.',
        ];
      } else if (nazivDokumenta.includes('punomoć') || nazivDokumenta.includes('ovlašćenje')) {
         predlozi = [
          'Ovo punomoćje se izdaje na period od godinu dana i važi do izričitog opoziva.',
          'Punomoćnik je ovlašćen da u moje ime preduzima sve radnje pred nadležnim državnim organima.',
        ];
      } else if (nazivDokumenta.includes('zahtev') || nazivDokumenta.includes('molba')) {
         predlozi = [
          'Molim vas da ovaj zahtev rešite u zakonskom roku po hitnom postupku usled neodložnih obaveza.',
          'Uz ovaj zahtev prilažem i kopiju važeće lične karte, kao i dokaz o uplati takse.',
        ];
      } else {
        predlozi = [
          'Navedene odredbe i uslovi ostaju na snazi do ispunjenja svih obaveza ugovornih strana.',
          'Sve eventualne sporove ugovorne strane će rešavati mirnim putem.',
        ];
      }

      return NextResponse.json({ predlozi });
    }

    // 2. Strukturisanje slobodnog teksta posebnih odredbi
    if (tip === 'strukturisi_odredbe') {
      if (!unos || unos.trim() === '') {
        return NextResponse.json({ formatiranTekst: '' });
      }
      
      const cistUnos = unos.trim();
      let formatiranTekst = `Ugovorne strane su se izričito saglasile sa sledećim posebnim uslovima: ${cistUnos}. Ovo je obavezujući deo dogovora.`;
      
      if (kontekst?.toLowerCase().includes('zahtev')) {
         formatiranTekst = `Poštovani, ovim putem ističem sledeće: ${cistUnos}. S poštovanjem.`;
      }
      
      return NextResponse.json({ formatiranTekst });
    }

    return NextResponse.json({ poruka: 'AI Asistencija je spremna' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Greška u AI modulu' }, { status: 500 });
  }
}
