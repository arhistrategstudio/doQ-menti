export type Valuta = 'RSD' | 'EUR' | 'none';

const JEDINICE_M = ['', 'jedan', 'dva', 'tri', 'četiri', 'pet', 'šest', 'sedam', 'osam', 'devet'];
const JEDINICE_Z = ['', 'jedna', 'dve', 'tri', 'četiri', 'pet', 'šest', 'sedam', 'osam', 'devet'];

const TINEJDZERI = [
  'deset', 'jedanaest', 'dvanaest', 'trinaest', 'četrnaest',
  'petnaest', 'šesnaest', 'sedamnaest', 'osamnaest', 'devetnaest'
];

const DESETICE = [
  '', '', 'dvadeset', 'trideset', 'četrdeset',
  'pedeset', 'šezdeset', 'sedamdeset', 'osamdeset', 'devedeset'
];

const STOTINE = [
  '', 'sto', 'dvesta', 'trista', 'četiristo',
  'petsto', 'šeststo', 'sedamsto', 'osamsto', 'devetsto'
];

function trocifreniBroj(n: number, zenskiRod: boolean): string {
  const s = Math.floor(n / 100);
  const ostatak = n % 100;
  const d = Math.floor(ostatak / 10);
  const j = ostatak % 10;

  const delovi: string[] = [];

  if (s > 0) {
    delovi.push(STOTINE[s]);
  }

  if (d === 1) {
    delovi.push(TINEJDZERI[j]);
  } else {
    if (d > 1) {
      delovi.push(DESETICE[d]);
    }
    if (j > 0) {
      delovi.push(zenskiRod ? JEDINICE_Z[j] : JEDINICE_M[j]);
    }
  }

  return delovi.join(' ');
}

export function brojSlovima(iznos: number | string, valuta: Valuta = 'none'): string {
  const num = typeof iznos === 'string' ? parseFloat(iznos.replace(/\./g, '').replace(',', '.')) : iznos;

  if (isNaN(num) || num < 0) {
    return '';
  }

  if (num === 0) {
    let rez = 'nula';
    if (valuta === 'RSD') rez += ' dinara';
    if (valuta === 'EUR') rez += ' evra';
    return rez;
  }

  const ceoDeo = Math.floor(num);
  const decimala = Math.round((num - ceoDeo) * 100);

  const milijarde = Math.floor(ceoDeo / 1_000_000_000);
  const milioni = Math.floor((ceoDeo % 1_000_000_000) / 1_000_000);
  const hiljade = Math.floor((ceoDeo % 1_000_000) / 1_000);
  const jedinice = ceoDeo % 1_000;

  const segmenti: string[] = [];

  if (milijarde > 0) {
    const txt = trocifreniBroj(milijarde, true);
    const zadnjaCifra = milijarde % 10;
    const zadnjeDve = milijarde % 100;
    let oblik = 'milijardi';
    if (zadnjeDve < 10 || zadnjeDve > 20) {
      if (zadnjaCifra === 1) oblik = 'milijarda';
      else if (zadnjaCifra >= 2 && zadnjaCifra <= 4) oblik = 'milijarde';
    }
    segmenti.push(`${txt} ${oblik}`);
  }

  if (milioni > 0) {
    const txt = trocifreniBroj(milioni, false);
    const zadnjaCifra = milioni % 10;
    const zadnjeDve = milioni % 100;
    let oblik = 'miliona';
    if (zadnjeDve < 10 || zadnjeDve > 20) {
      if (zadnjaCifra === 1) oblik = 'milion';
      else if (zadnjaCifra >= 2 && zadnjaCifra <= 4) oblik = 'miliona';
    }
    segmenti.push(`${txt} ${oblik}`);
  }

  if (hiljade > 0) {
    const txt = trocifreniBroj(hiljade, true);
    const zadnjaCifra = hiljade % 10;
    const zadnjeDve = hiljade % 100;
    let oblik = 'hiljada';
    if (zadnjeDve < 10 || zadnjeDve > 20) {
      if (zadnjaCifra === 1) oblik = 'hiljada';
      else if (zadnjaCifra >= 2 && zadnjaCifra <= 4) oblik = 'hiljade';
    }
    segmenti.push(`${txt} ${oblik}`);
  }

  if (jedinice > 0) {
    segmenti.push(trocifreniBroj(jedinice, false));
  }

  let text = segmenti.join(' ').trim();

  // Dodavanje valute
  if (valuta === 'RSD') {
    const zadnjaCifra = ceoDeo % 10;
    const zadnjeDve = ceoDeo % 100;
    let oblikValute = 'dinara';
    if (zadnjeDve < 10 || zadnjeDve > 20) {
      if (zadnjaCifra === 1) oblikValute = 'dinar';
      else if (zadnjaCifra >= 2 && zadnjaCifra <= 4) oblikValute = 'dinara';
    }
    text += ` ${oblikValute}`;
  } else if (valuta === 'EUR') {
    const zadnjaCifra = ceoDeo % 10;
    const zadnjeDve = ceoDeo % 100;
    let oblikValute = 'evra';
    if (zadnjeDve < 10 || zadnjeDve > 20) {
      if (zadnjaCifra === 1) oblikValute = 'evro';
      else if (zadnjaCifra >= 2 && zadnjaCifra <= 4) oblikValute = 'evra';
    }
    text += ` ${oblikValute}`;
  }

  if (decimala > 0) {
    text += ` i ${decimala}/100`;
  }

  return text;
}
