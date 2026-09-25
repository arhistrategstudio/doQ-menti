import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5';
const DISCLAIMER = 'Automatski predlog — nije pravni savet. Proverite pre upotrebe.';

const SISTEM = `Ti si asistent za sastavljanje pravnih dokumenata za Republiku Srbiju.
Pišeš jasnim, formalnim srpskim jezikom, u pravnom stilu.
STROGA PRAVILA:
- NE izmišljaj konkretne članove zakona, brojeve/nazive propisa, rokove ni sudsku praksu. Ako nešto ne znaš pouzdano, ne navodi.
- Ne daješ pravni savet niti garancije; samo pomažeš u formulaciji teksta.
- Piši isključivo u traženom pismu (latinica ili ćirilica).
- Budi konkretan i kratak, bez uvoda i objašnjenja — vrati samo traženi sadržaj.`;

// Osnovna zaštita od zloupotrebe: max 10 zahteva po IP adresi u minuti (po instanci servera).
const LIMIT = 10;
const zahtevi = new Map<string, number[]>();
function prekoracen(ip: string): boolean {
  const sada = Date.now();
  const niz = (zahtevi.get(ip) || []).filter((t) => sada - t < 60_000);
  niz.push(sada);
  zahtevi.set(ip, niz);
  return niz.length > LIMIT;
}

async function pozovi(prompt: string, maxTokens = 800): Promise<string> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const r = await client.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system: SISTEM,
    messages: [{ role: 'user', content: prompt }],
  });
  return (r.content as Array<{ type: string; text?: string }>)
    .filter((b) => b.type === 'text')
    .map((b) => b.text || '')
    .join('\n')
    .trim();
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'AI trenutno nije konfigurisan (nedostaje API ključ).' },
      { status: 503 }
    );
  }
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'nepoznat';
  if (prekoracen(ip)) {
    return NextResponse.json({ error: 'Previše zahteva. Pokušajte ponovo za minut.' }, { status: 429 });
  }
  try {
    const { tip, unos, kontekst, pismo } = await req.json();
    if ((typeof unos === 'string' && unos.length > 4000) || (typeof kontekst === 'string' && kontekst.length > 300)) {
      return NextResponse.json({ error: 'Tekst je predugačak.' }, { status: 400 });
    }
    const pismoTekst = pismo === 'cirilica' ? 'ćirilica' : 'latinica';
    const dok = kontekst || 'opšti dokument';

    if (tip === 'predlog_odredbi') {
      const text = await pozovi(
        `Dokument: "${dok}". Predloži 3 do 5 čestih, korisnih posebnih odredbi/klauzula za ovaj dokument. Pismo: ${pismoTekst}. Vrati SAMO listu — svaka odredba u jednom redu, bez numeracije i bez dodatnog teksta.`,
        600
      );
      const predlozi = text
        .split('\n')
        .map((s) => s.replace(/^[-•\d.)\s]+/, '').trim())
        .filter(Boolean)
        .slice(0, 5);
      return NextResponse.json({ predlozi, disclaimer: DISCLAIMER });
    }

    if (tip === 'strukturisi_odredbe') {
      if (!unos || !unos.trim())
        return NextResponse.json({ error: 'Nema teksta za doradu.' }, { status: 400 });
      const formatiranTekst = await pozovi(
        `Dokument: "${dok}". Korisnik je uneo grub tekst. Pravno i jezički doteraj ga u formalan srpski pravni stil. Zadrži smisao i SVE činjenice koje je korisnik naveo; NE dodaji nove činjenice ni zakonske odredbe. Pismo: ${pismoTekst}. Vrati SAMO dorađen tekst.\n\nTEKST:\n${unos}`,
        1000
      );
      return NextResponse.json({ formatiranTekst, disclaimer: DISCLAIMER });
    }

    if (tip === 'obrazlozenje') {
      const formatiranTekst = await pozovi(
        `Dokument: "${dok}". Na osnovu sledećih činjenica napiši obrazloženje/tekst zahteva u formalnom srpskom pravnom stilu. NE izmišljaj činjenice ni zakonske odredbe. Pismo: ${pismoTekst}. Vrati SAMO tekst obrazloženja.\n\nČINJENICE:\n${unos || ''}`,
        1000
      );
      return NextResponse.json({ formatiranTekst, disclaimer: DISCLAIMER });
    }

    return NextResponse.json({ error: 'Nepoznat tip zahteva.' }, { status: 400 });
  } catch (e) {
    console.error('AI greška', e);
    return NextResponse.json({ error: 'Greška pri komunikaciji sa AI servisom.' }, { status: 500 });
  }
}
