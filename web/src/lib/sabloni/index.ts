import Handlebars from 'handlebars';
import { brojSlovima, Valuta } from '../slovima';
import { presloviTekst, presloviObjekat, Pismo } from '../pismo';

// Registracija standardnih helpera
Handlebars.registerHelper('slovima', function (iznos: any, valuta: any) {
  if (!iznos) return '____________________';
  const v = typeof valuta === 'string' ? (valuta as Valuta) : 'RSD';
  return brojSlovima(iznos, v);
});

Handlebars.registerHelper('formatDatum', function (datumStr: any) {
  if (!datumStr) return '_______. godine';
  try {
    const d = new Date(datumStr);
    if (isNaN(d.getTime())) return datumStr;
    const dan = String(d.getDate()).padStart(2, '0');
    const mesec = String(d.getMonth() + 1).padStart(2, '0');
    const godina = d.getFullYear();
    return `${dan}.${mesec}.${godina}. godine`;
  } catch {
    return datumStr;
  }
});

Handlebars.registerHelper('formatIznos', function (iznos: any) {
  if (iznos === undefined || iznos === null || iznos === '') return '__________';
  const num = typeof iznos === 'string' ? parseFloat(iznos.replace(/\./g, '').replace(',', '.')) : iznos;
  if (isNaN(num)) return iznos;
  return new Intl.NumberFormat('sr-RS', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
});

Handlebars.registerHelper('podvuceno', function (vrednost: any, duzina: any) {
  if (vrednost !== undefined && vrednost !== null && String(vrednost).trim() !== '') {
    return vrednost;
  }
  const len = typeof duzina === 'number' ? duzina : 20;
  return '_'.repeat(len);
});

Handlebars.registerHelper('eq', function (a: any, b: any) {
  return a === b;
});

Handlebars.registerHelper('neq', function (a: any, b: any) {
  return a !== b;
});

Handlebars.registerHelper('or', function (a: any, b: any) {
  return a || b;
});

Handlebars.registerHelper('and', function (a: any, b: any) {
  return a && b;
});

export interface PopuniSablonOpcije {
  pismo?: Pismo;
  vodeniZig?: boolean;
}

export function popuniSablon(
  sablonTekst: string,
  podaci: Record<string, any>,
  opcije: PopuniSablonOpcije = {}
): string {
  const pismo = opcije.pismo || 'latinica';

  // Kompajliranje šablona
  const template = Handlebars.compile(sablonTekst);
  const rawHtml = template(podaci);

  // Preslovljavanje ako je izabrana ćirilica
  if (pismo === 'cirilica') {
    return presloviTekst(rawHtml, 'cirilica');
  }

  return rawHtml;
}
