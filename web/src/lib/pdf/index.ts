import path from 'path';
// @ts-ignore
import pdfmake from 'pdfmake';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import { brojSlovima } from '../slovima';
import { presloviTekst, presloviObjekat, Pismo } from '../pismo';
import type { KupoprodajaVozilaData } from '@/sabloni/kupoprodaja-vozila/polja';

const fontoviDir = path.join(process.cwd(), 'node_modules', 'pdfmake', 'fonts', 'Roboto');

const fonts = {
  Roboto: {
    normal: path.join(fontoviDir, 'Roboto-Regular.ttf'),
    bold: path.join(fontoviDir, 'Roboto-Medium.ttf'),
    italics: path.join(fontoviDir, 'Roboto-Italic.ttf'),
    bolditalics: path.join(fontoviDir, 'Roboto-MediumItalic.ttf'),
  },
};

// Registracija fontova u pdfmake
try {
  pdfmake.addFonts(fonts);
} catch {
  // Ignorisati ako su već dodati
}

export async function kreirajPdfBuffer(docDefinition: TDocumentDefinitions): Promise<Buffer> {
  const doc = pdfmake.createPdf(docDefinition);
  return await doc.getBuffer();
}

function formatirajDatum(datumStr?: string): string {
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
}

function formatirajIznos(iznos?: number | string): string {
  if (iznos === undefined || iznos === null || iznos === '') return '__________';
  const num = typeof iznos === 'string' ? parseFloat(iznos.replace(/\./g, '').replace(',', '.')) : iznos;
  if (isNaN(num)) return String(iznos);
  return new Intl.NumberFormat('sr-RS', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

function kupacTekst(podaci: any, pismo: Pismo): string {
  const t = (lat: string, cir: string) => (pismo === 'cirilica' ? cir : lat);
  return `${podaci.kupacImePrezime || '________________________________'}${t(', iz mesta ', ', из места ')}${podaci.kupacMesto || '________________'}${t(', adresa ', ', адреса ')}${podaci.kupacAdresa || '________________________________'}, JMBG: ${podaci.kupacJmbg || '_____________'}${t(', br. lične karte: ', ', бр. лиčne karte: ')}${podaci.kupacBrojLk || '________'}${t(', izdate od ', ', издате од ')}${podaci.kupacMupLk || '________________'}${t(' (u daljem tekstu: Kupac).', ' (у даљем тексту: Купац).')}`;
}

export async function generisiPdfKupoprodajaVozila(
  siroviPodaci: KupoprodajaVozilaData,
  opcije: { pismo?: Pismo; vodeniZig?: boolean } = {}
): Promise<Buffer> {
  const pismo = opcije.pismo || 'latinica';
  const podaci = presloviObjekat(siroviPodaci, pismo);

  const t = (lat: string, cir: string) => (pismo === 'cirilica' ? cir : lat);

  const formatiranaCena = `${formatirajIznos(podaci.cenaIznos)} ${podaci.cenaValuta === 'EUR' ? 'EUR' : (pismo === 'cirilica' ? 'РСД' : 'RSD')}`;
  const cenaSlovimaTekst = brojSlovima(podaci.cenaIznos, podaci.cenaValuta);
  const preslovljenaCenaSlovima = pismo === 'cirilica' ? presloviTekst(cenaSlovimaTekst, 'cirilica') : cenaSlovimaTekst;

  let tekstIsplate = '';
  if (podaci.nacinPlacanja === 'gotovina') {
    tekstIsplate = t(
      'Kupac je ugovorenu kupoprodajnu cenu isplatio Prodavcu u celosti u gotovom novcu na dan potpisivanja ovog ugovora, što Prodavac potvrđuje svojim potpisom na ovom ugovoru i izdaje punovažnu priznanicu.',
      'Купац је уговорену купопродајну цену исплатио Продавцу у целости у готовом новцу на дан потписивања овог уговора, што Продавац потврђује својим потписом на овом уговору и издаје пуноважну признаницу.'
    );
  } else if (podaci.nacinPlacanja === 'racun') {
    const racun = podaci.prodavacTekuciRacun || '_________________________';
    const rok = podaci.rokPlacanjaDana || '3';
    tekstIsplate = t(
      `Kupac će ugovorenu kupoprodajnu cenu uplatiti na tekući račun Prodavca broj ${racun} u roku od ${rok} dana od dana overe ovog ugovora.`,
      `Купац ће уговорену купопродајну цену уплатити на текући рачун Продавца број ${racun} у roku од ${rok} дана од дана овере овог уговора.`
    );
  } else {
    tekstIsplate = t(
      'Kupac je ugovorenu kupoprodajnu cenu isplatio Prodavcu u celosti u gotovom novcu pre overe ovog ugovora, što Prodavac potvrđuje svojim potpisom.',
      'Купац је уговорену купопродајну цену исплатио Продавцу у целости у готовом новцу пре овере овог уговора, што Продавац потврђује својим потписом.'
    );
  }

  const docDefinition: TDocumentDefinitions = {
    pageSize: 'A4',
    pageMargins: [40, 45, 40, 45],
    defaultStyle: {
      font: 'Roboto',
      fontSize: 10,
      lineHeight: 1.25,
      color: '#111827',
    },
    ...(opcije.vodeniZig
      ? {
          watermark: {
            text: 'PREGLED / NIJE ZA ŠTAMPU',
            color: '#ef4444',
            opacity: 0.15,
            bold: true,
            italics: false,
          },
        }
      : {}),
    content: [
      {
        text: t(
          'UGOVOR O KUPOPRODAJI UPOTREBLJAVANOG MOTOROG VOZILA',
          'УГОВОР О КУПОПРОДАЈИ УПОТРЕБЉАВАНОГ МОТОРНОГ ВОЗИЛА'
        ),
        fontSize: 13,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 14],
      },
      {
        text: [
          t('Zaključen u mestu ', 'Закључен у месту '),
          { text: podaci.mestoZakljucenja || '________________', bold: true },
          t(', dana ', ', дана '),
          { text: formatirajDatum(podaci.datumZakljucenja), bold: true },
          t(', između sledećih ugovornih strana:\n', ', између следећих уговорних страна:\n'),
        ],
        margin: [0, 0, 0, 8],
      },
      {
        table: {
          widths: ['*'],
          body: [
            [
              {
                fillColor: '#f9fafb',
                margin: [8, 6, 8, 6],
                stack: [
                  {
                    text: t('1. PRODAVAC:', '1. ПРОДАВАЦ:'),
                    bold: true,
                    margin: [0, 0, 0, 3],
                  },
                  {
                    text: [
                      { text: podaci.prodavacImePrezime || '________________________________', bold: true },
                      t(', iz mesta ', ', из места '),
                      podaci.prodavacMesto || '________________',
                      t(', adresa ', ', адреса '),
                      podaci.prodavacAdresa || '________________________________',
                      ', JMBG: ',
                      { text: podaci.prodavacJmbg || '_____________', bold: true },
                      t(', br. lične karte: ', ', бр. лиčne karte: '),
                      podaci.prodavacBrojLk || '________',
                      t(', izdate od ', ', издате од '),
                      podaci.prodavacMupLk || '________________',
                      t(' (u daljem tekstu: Prodavac).', ' (у даљем тексту: Продавац).'),
                    ],
                  },
                ],
              },
            ],
            [
              {
                fillColor: '#f9fafb',
                margin: [8, 6, 8, 6],
                stack: [
                  {
                    text: t('2. KUPAC:', '2. КУПАЦ:'),
                    bold: true,
                    margin: [0, 0, 0, 3],
                  },
                  {
                    text: [
                      { text: kupacTekst(podaci, pismo) },
                    ],
                  },
                ],
              },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
        },
        margin: [0, 0, 0, 10],
      },
      {
        text: t('Član 1. Predmet ugovora', 'Члан 1. Предмет уговора'),
        bold: true,
        alignment: 'center',
        margin: [0, 6, 0, 4],
      },
      {
        text: t(
          'Prodavac prodaje, a Kupac kupuje upotrebljavano motorno vozilo sa sledećim identifikacionim podacima:',
          'Продавац продаје, а Купац купује употребљавано моторно возило са следећим идентификационим подацима:'
        ),
        margin: [0, 0, 0, 4],
      },
      {
        columns: [
          {
            width: '50%',
            stack: [
              { text: [{ text: t('Marka i model: ', 'Марка и модел: '), bold: true }, `${podaci.voziloMarka || '_______'} ${podaci.voziloModel || '_______'}`] },
              { text: [{ text: t('Broj šasije (VIN): ', 'Број шасије (VIN): '), bold: true }, podaci.voziloBrojSasije || '_________________'] },
              { text: [{ text: t('Broj motora: ', 'Број мотора: '), bold: true }, podaci.voziloBrojMotora || '_________________'] },
              { text: [{ text: t('Godina proizvodnje: ', 'Година proizvodnje: '), bold: true }, `${podaci.voziloGodina || '____'}.`] },
            ],
          },
          {
            width: '50%',
            stack: [
              { text: [{ text: t('Radna zapremina: ', 'Радна запремина: '), bold: true }, `${podaci.voziloKubikaza || '____'} cm³`] },
              { text: [{ text: t('Snaga motora: ', 'Снага мотора: '), bold: true }, `${podaci.voziloSnagaKw || '____'} kW`] },
              { text: [{ text: t('Registarska oznaka: ', 'Регистарска ознака: '), bold: true }, podaci.voziloRegistracija || '___________'] },
              { text: [{ text: t('Boja vozila: ', 'Боја возила: '), bold: true }, podaci.voziloBoja || '___________'] },
            ],
          },
        ],
        margin: [0, 0, 0, 8],
      },
      {
        text: t('Član 2. Kupoprodajna cena', 'Члан 2. Купопродајна цена'),
        bold: true,
        alignment: 'center',
        margin: [0, 4, 0, 4],
      },
      {
        text: [
          t('Ugovorne strane su sporazumno utvrdile prodajnu cenu vozila u iznosu od ', 'Уговорне стране су споразумно утврдиле продајну цену возила у износу од '),
          { text: formatiranaCena, bold: true },
          t(' (slovima: ', ' (словима: '),
          { text: preslovljenaCenaSlovima, italics: true },
          t(').\n', ').\n'),
          tekstIsplate,
        ],
        margin: [0, 0, 0, 8],
      },
      {
        text: t('Član 3. Stanje vozila i primopredaja', 'Члан 3. Стање возила и примопредаја'),
        bold: true,
        alignment: 'center',
        margin: [0, 4, 0, 4],
      },
      {
        text: t(
          'Kupac izjavljuje da je pre potpisivanja ovog ugovora izvršio detaljan vizuelni i tehnički pregled vozila, da mu je stanje vozila u potpunosti poznato i da ga kupuje u viđenom i isprobanom stanju, bez prava na naknadne reklamacije koje se odnose na vidljive nedostatke. Prodavac predaje Kupcu vozilo u posed, zajedno sa ključevima i saobraćajnom dozvolom, na dan overe ugovora.',
          'Купац изјављује да је пре потписивања овог уговора извршио детаљан визуелни и технички преглед возила, да му је стање возила у потпуности познато и да га купује у виђеном и испробаном стању, без права на накнадне рекламације које се односе на видљиве недостатке. Продавац предаје Купцу возило у посед, заједно са кључевима и саобраћајном дозволом, на дан овере уговора.'
        ),
        margin: [0, 0, 0, 8],
      },
      {
        text: t('Član 4. Garancija pravne valjanosti', 'Члан 4. Гаранција правне ваљаности'),
        bold: true,
        alignment: 'center',
        margin: [0, 4, 0, 4],
      },
      {
        text: t(
          'Prodavac garantuje pod punom materijalnom i krivičnom odgovornošću da je isključivi vlasnik vozila, da vozilo nije opterećeno nikakvim teretima, zalogama, zabranama otuđenja niti pravima trećih lica, kao i da vozilo nije predmet sudskog ili upravnog spora.',
          'Продавац гарантује под пуном материјалном и кривичном одговорношћу да је искључиви власник возила, да возило није оптерећено никаквим теретима, залогама, забранама отуђења нити правима трећих лица, као и да возило није предмет судског или управног спора.'
        ),
        margin: [0, 0, 0, 8],
      },
      {
        text: t('Član 5. Prenos vlasništva i troškovi', 'Члан 5. Пренос власништва и troškovi'),
        bold: true,
        alignment: 'center',
        margin: [0, 4, 0, 4],
      },
      {
        text: [
          t('Ugovorne strane su saglasne da troškove overe ovog ugovora kod javnog beležnika, porez na prenos apsolutnih prava i troškove izdavanja nove saobraćajne dozvole snosi ', 'Уговорне стране су сагласне да troškove овере овог уговора код јавног бележника, порез на пренос апсолутних права и troškove издавања нове саобраћајне dozvole сноси '),
          { text: podaci.troskoveSnosi === 'prodavac' ? t('Prodavac', 'Продавац') : t('Kupac', 'Купац'), bold: true },
          t('. Kupac se obavezuje da u roku od ', '. Купац се обавезује да у roku од '),
          { text: t('30 dana', '30 dana'), bold: true },
          t(
            ' od dana overe ovog ugovora izvrši prijavu poreske obaveze, plati porez i podnese zahtev kod nadležnog MUP-a radi izdavanja saobraćajne dozvole na svoje ime.',
            ' од dana овере ovog ugovora izvrši prijavu poreske obaveze, plati porez i podnese zahtev kod nadležnog MUP-a radi izdavanja saobraćajne dozvole na svoje ime.'
          ),
        ],
        margin: [0, 0, 0, 8],
      },
      ...(podaci.posebneOdredbe
        ? [
            {
              text: t('Član 6. Posebne odredbe', 'Члан 6. Посебне odredbe'),
              bold: true,
              alignment: 'center' as const,
              margin: [0, 4, 0, 4] as [number, number, number, number],
            },
            {
              text: podaci.posebneOdredbe,
              margin: [0, 0, 0, 8] as [number, number, number, number],
            },
          ]
        : []),
      {
        text: t(
          `Član ${podaci.posebneOdredbe ? '7' : '6'}. Završne odredbe`,
          `Члан ${podaci.posebneOdredbe ? '7' : '6'}. Завршне odredbe`
        ),
        bold: true,
        alignment: 'center',
        margin: [0, 4, 0, 4],
      },
      {
        text: t(
          'Za sve što nije definisano ovim ugovorom primenjuju se odredbe Zakona o obligacionim odnosima Republike Srbije. Ovaj ugovor sačinjen je u 4 (četiri) istovetna primerka.',
          'За све што није дефинисано овим уговором примењују се одредбе Закона о облигационим односима Републике Србије. Овај уговор сачињен је у 4 (четири) истоветна примерка.'
        ),
        margin: [0, 0, 0, 20],
      },
      {
        columns: [
          {
            width: '45%',
            alignment: 'center',
            stack: [
              { text: t('PRODAVAC:', 'ПРОДАВАЦ:'), bold: true, margin: [0, 0, 0, 30] },
              { text: '________________________________', margin: [0, 0, 0, 4] },
              { text: `(${podaci.prodavacImePrezime || t('ime i prezime', 'име и презиме')})`, fontSize: 9 },
            ],
          },
          { width: '10%', text: '' },
          {
            width: '45%',
            alignment: 'center',
            stack: [
              { text: t('KUPAC:', 'КУПАЦ:'), bold: true, margin: [0, 0, 0, 30] },
              { text: '________________________________', margin: [0, 0, 0, 4] },
              { text: `(${podaci.kupacImePrezime || t('ime i prezime', 'име и презиме')})`, fontSize: 9 },
            ],
          },
        ],
      },
    ],
  };

  return kreirajPdfBuffer(docDefinition);
}
