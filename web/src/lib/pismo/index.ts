export type Pismo = 'latinica' | 'cirilica';

// Reči u kojima se dvoslovi (dž, dj, nj, lj) NE spajaju
const IZUZECI: Record<string, string> = {
  injekcija: 'инјекција',
  injekcije: 'инјекције',
  injekciju: 'инјекцију',
  injekcijom: 'инјекцијом',
  konjunkcija: 'конјункција',
  konjunkcije: 'конјункције',
  nadživeti: 'надживети',
  nadživeo: 'надживео',
  nadživela: 'надживела',
  podjednako: 'подједнако',
  predjelo: 'предјело',
  predjela: 'предјела',
  odžeti: 'оджети',
  odživeo: 'одживео',
};

const MAPA_DVOSLOVA: Record<string, string> = {
  DŽ: 'Џ',
  Dž: 'Џ',
  dž: 'џ',
  LJ: 'Љ',
  Lj: 'Љ',
  lj: 'љ',
  NJ: 'Њ',
  Nj: 'Њ',
  nj: 'њ',
};

const MAPA_JEDNOSLOVA: Record<string, string> = {
  A: 'А', a: 'а',
  B: 'Б', b: 'б',
  V: 'В', v: 'в',
  G: 'Г', g: 'г',
  D: 'Д', d: 'д',
  Đ: 'Ђ', đ: 'ђ', DJ: 'Ђ', Dj: 'Ђ', dj: 'ђ',
  E: 'Е', e: 'е',
  Ž: 'Ж', ž: 'ж',
  Z: 'З', z: 'з',
  I: 'И', i: 'и',
  J: 'Ј', j: 'ј',
  K: 'К', k: 'к',
  L: 'Л', l: 'л',
  M: 'М', m: 'м',
  N: 'Н', n: 'н',
  O: 'О', o: 'о',
  P: 'П', p: 'п',
  R: 'Р', r: 'р',
  S: 'С', s: 'с',
  T: 'Т', t: 'т',
  Ć: 'Ћ', ć: 'ћ',
  U: 'У', u: 'у',
  F: 'Ф', f: 'ф',
  H: 'Х', h: 'х',
  C: 'Ц', c: 'ц',
  Č: 'Ч', č: 'ч',
  Š: 'Ш', š: 'ш',
};

export function presloviTekst(tekst: string, ciljnoPismo: Pismo): string {
  if (!tekst || ciljnoPismo === 'latinica') {
    return tekst;
  }

  let rezultat = tekst;

  // 1. Zameni poznate izuzetke
  for (const [lat, cir] of Object.entries(IZUZECI)) {
    const reg = new RegExp(`\\b${lat}\\b`, 'gi');
    rezultat = rezultat.replace(reg, (match) => {
      if (match === match.toUpperCase()) return cir.toUpperCase();
      if (match[0] === match[0].toUpperCase()) return cir[0].toUpperCase() + cir.slice(1);
      return cir;
    });
  }

  // 2. Zameni dvoslove
  for (const [lat, cir] of Object.entries(MAPA_DVOSLOVA)) {
    rezultat = rezultat.replaceAll(lat, cir);
  }

  // 3. Zameni jednoslove
  let konacno = '';
  for (let i = 0; i < rezultat.length; i++) {
    const char = rezultat[i];
    konacno += MAPA_JEDNOSLOVA[char] || char;
  }

  return konacno;
}

const PODRAZUMEVANA_POLJA_BEZ_PRESLOVLJAVANJA = [
  'jmbg', 'vin', 'brojsasije', 'registracija', 'registarskanoznaka', 'registarskaoznaka',
  'email', 'brojracuna', 'tekuciracun', 'pib', 'maticnibroj', 'brojlicnekarte', 'brojlk', 'brojmotora',
  'vozilobrojsasije', 'vozilobrojmotora', 'voziloregistracija', 'prodavacjmbg', 'kupacjmbg',
  'prodavacbrojlk', 'kupacbrojlk', 'prodavactekuciracun'
];

export function presloviObjekat<T extends Record<string, any>>(
  podaci: T,
  ciljnoPismo: Pismo,
  poljaBezPreslovljavanja: string[] = PODRAZUMEVANA_POLJA_BEZ_PRESLOVLJAVANJA
): T {
  if (ciljnoPismo === 'latinica') {
    return podaci;
  }

  const ignoreSet = new Set(
    poljaBezPreslovljavanja.map((p) => p.toLowerCase())
  );

  const noviPodaci: Record<string, any> = {};

  for (const [kljuc, vrednost] of Object.entries(podaci)) {
    const normKljuc = kljuc.toLowerCase();
    const trebaPreskociti = ignoreSet.has(normKljuc) || 
      [...ignoreSet].some((p) => normKljuc.includes(p));

    if (trebaPreskociti) {
      noviPodaci[kljuc] = vrednost;
    } else if (typeof vrednost === 'string') {
      noviPodaci[kljuc] = presloviTekst(vrednost, ciljnoPismo);
    } else if (typeof vrednost === 'object' && vrednost !== null && !Array.isArray(vrednost)) {
      noviPodaci[kljuc] = presloviObjekat(vrednost, ciljnoPismo, poljaBezPreslovljavanja);
    } else if (Array.isArray(vrednost)) {
      noviPodaci[kljuc] = vrednost.map((item) =>
        typeof item === 'string' ? presloviTekst(item, ciljnoPismo) : item
      );
    } else {
      noviPodaci[kljuc] = vrednost;
    }
  }

  return noviPodaci as T;
}
