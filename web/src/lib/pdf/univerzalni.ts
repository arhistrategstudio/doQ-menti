import path from 'path';
// @ts-ignore
import pdfmake from 'pdfmake';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import { presloviTekst, presloviObjekat, Pismo } from '../pismo';

const fontoviDir = path.join(process.cwd(), 'node_modules', 'pdfmake', 'fonts', 'Roboto');
const fonts = {
  Roboto: {
    normal: path.join(fontoviDir, 'Roboto-Regular.ttf'),
    bold: path.join(fontoviDir, 'Roboto-Medium.ttf'),
    italics: path.join(fontoviDir, 'Roboto-Italic.ttf'),
    bolditalics: path.join(fontoviDir, 'Roboto-MediumItalic.ttf'),
  },
};

try {
  pdfmake.addFonts(fonts);
} catch {}

export async function generisiUniverzalniObrazacPdf(
  nazivObrasca: string,
  kategorija: string,
  podaci: {
    podnosilacIme: string;
    podnosilacMesto: string;
    podnosilacAdresa: string;
    podnosilacTelefon: string;
    podnosilacEmail: string;
    organKomeSePodnosi: string;
    predmetZahteva: string;
    obrazlozenje: string;
    prilozi: string;
    mesto: string;
    datum: string;
  },
  opcije: { pismo?: Pismo } = {}
): Promise<Buffer> {
  const pismo = opcije.pismo || 'latinica';
  const t = (lat: string, cir: string) => (pismo === 'cirilica' ? cir : lat);

  const docDefinition: TDocumentDefinitions = {
    pageSize: 'A4',
    pageMargins: [45, 50, 45, 50],
    defaultStyle: {
      font: 'Roboto',
      fontSize: 10,
      lineHeight: 1.3,
      color: '#111827',
    },
    content: [
      {
        text: podaci.organKomeSePodnosi || t('Nadležnom organu / ustanovi', 'Надлежном органу / установи'),
        fontSize: 11,
        bold: true,
        alignment: 'right',
        margin: [0, 0, 0, 20],
      },
      {
        text: presloviTekst(nazivObrasca.toUpperCase(), pismo),
        fontSize: 13,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 20],
      },
      {
        text: t('PODNOSILAC ZAHTEVA / OBRASCA:', 'ПОДНОСИЛАЦ ЗАХТЕВА / ОБРАСЦА:'),
        fontSize: 10,
        bold: true,
        margin: [0, 0, 0, 6],
      },
      {
        table: {
          widths: ['30%', '70%'],
          body: [
            [{ text: t('Ime i prezime / Naziv:', 'Име и презиме / Назив:'), bold: true }, podaci.podnosilacIme || '________________________________'],
            [{ text: t('Prebivalište / Sedište:', 'Пребивалиште / Седиште:'), bold: true }, `${podaci.podnosilacMesto || '_______'}, ${podaci.podnosilacAdresa || '___________________'}`],
            [{ text: t('Kontakt telefon:', 'Контакт телефон:'), bold: true }, podaci.podnosilacTelefon || '________________'],
            [{ text: t('Email adresa:', 'Email адреса:'), bold: true }, podaci.podnosilacEmail || '________________'],
          ],
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
        },
        margin: [0, 0, 0, 16],
      },
      {
        text: [{ text: t('PREDMET: ', 'ПРЕДМЕТ: '), bold: true }, podaci.predmetZahteva || t('Zahtev / Prijava po obrascu', 'Захтев / Пријава по обрасцу')],
        fontSize: 11,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      {
        text: t('OBRAZLOŽENJE / SADRŽINA:', 'ОБРАЗЛОЖЕЊЕ / САДРЖИНА:'),
        fontSize: 10,
        bold: true,
        margin: [0, 0, 0, 4],
      },
      {
        text: podaci.obrazlozenje || t('Ovim putem se obraćam nadležnom organu sa zahtevom u skladu sa važećim propisima.', 'Овим путем се обраћам надлежном органу са захтевом у складу са важећим прописима.'),
        margin: [0, 0, 0, 16],
      },
      ...(podaci.prilozi ? [
        {
          text: t('PRILOZI:', 'ПРИЛОЗИ:'),
          fontSize: 10,
          bold: true,
          margin: [0, 0, 0, 4] as [number, number, number, number],
        },
        {
          text: podaci.prilozi,
          margin: [0, 0, 0, 16] as [number, number, number, number],
        }
      ] : []),
      {
        columns: [
          {
            width: '50%',
            text: [
              t('U mestu: ', 'У месту: '),
              { text: podaci.mesto || '____________', bold: true },
              t('\nDatum: ', '\nДатум: '),
              { text: podaci.datum || '____________. godine', bold: true },
            ],
          },
          {
            width: '50%',
            alignment: 'center',
            stack: [
              { text: t('PODNOSILAC:', 'ПОДНОСИЛАЦ:'), bold: true, margin: [0, 0, 0, 30] },
              { text: '________________________________', margin: [0, 0, 0, 4] },
              { text: `(${podaci.podnosilacIme || t('potpis', 'потпис')})`, fontSize: 9 },
            ],
          },
        ],
        margin: [0, 25, 0, 0],
      },
    ],
  };

  const doc = pdfmake.createPdf(docDefinition);
  return await doc.getBuffer();
}
