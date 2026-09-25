import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PDFDocument, PDFTextField, PDFCheckBox, PDFDropdown, PDFRadioGroup, PDFOptionList } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { putanjaObrasca } from '@/lib/obrasci/putanja';

export const runtime = 'nodejs';

// Font sa srpskim latiničnim i ćiriličnim slovima (standardni PDF fontovi nemaju č, ć, đ, ž, š ni ćirilicu).
const FONT = path.join(process.cwd(), 'node_modules', 'pdfmake', 'fonts', 'Roboto', 'Roboto-Regular.ttf');

// Upisuje vrednosti u polja ORIGINALNOG PDF obrasca, pa izgled ostaje isti kao original.
export async function POST(req: NextRequest) {
  try {
    const { izvor, kategorija = '', fajl = '', vrednosti = {} } = await req.json();
    const putanja = putanjaObrasca(izvor, kategorija, fajl);
    if (!putanja || !fajl.toLowerCase().endsWith('.pdf') || !fs.existsSync(putanja)) {
      return NextResponse.json({ error: 'Obrazac nije pronađen.' }, { status: 404 });
    }

    const pdf = await PDFDocument.load(fs.readFileSync(putanja), { ignoreEncryption: true });
    pdf.registerFontkit(fontkit);
    const font = await pdf.embedFont(fs.readFileSync(FONT), { subset: true });
    const form = pdf.getForm();

    for (const polje of form.getFields()) {
      const v = (vrednosti as Record<string, unknown>)[polje.getName()];
      if (v === undefined || v === null) continue;
      try {
        if (polje instanceof PDFTextField) polje.setText(String(v));
        else if (polje instanceof PDFCheckBox) (v === true || v === 'true' || v === 'On' ? polje.check() : polje.uncheck());
        else if (polje instanceof PDFDropdown || polje instanceof PDFOptionList) { if (v) polje.select(String(v)); }
        else if (polje instanceof PDFRadioGroup) { if (v) polje.select(String(v)); }
      } catch (e) {
        console.warn('Polje nije popunjeno:', polje.getName(), e);
      }
    }

    form.updateFieldAppearances(font);
    try {
      form.flatten(); // upisane vrednosti postaju deo stranice — isti izgled u svakom pregledaču i pri štampi
    } catch (e) {
      console.warn('Flatten nije uspeo, polja ostaju popunjiva:', e);
    }

    const bajtovi = await pdf.save();
    const ime = `${fajl.replace(/\.pdf$/i, '')}_popunjen.pdf`;
    return new NextResponse(new Uint8Array(bajtovi), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(ime)}"`,
      },
    });
  } catch (error) {
    console.error('Greška pri popunjavanju originalnog obrasca:', error);
    return NextResponse.json({ error: 'Greška pri popunjavanju obrasca.' }, { status: 500 });
  }
}
