'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Download, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';
import { popuniSablon } from '@/lib/sabloni';
import { SADRZAJ_KUPOPRODAJA_VOZILA } from '@/sabloni/kupoprodaja-vozila/sadrzaj';
import { Pismo } from '@/lib/pismo';
import { FormaPolja } from '@/components/ugovori/kupoprodaja/FormaPolja';
import { SablonPreview } from '@/components/ugovori/kupoprodaja/SablonPreview';
import { PlacanjeModal } from '@/components/placanje/PlacanjeModal';

const SABLON_TEKST = `
<div class="ugovor-papir font-serif text-gray-900 leading-relaxed text-sm">
  <div class="text-center font-bold text-base uppercase mb-6 tracking-wide border-b pb-4 border-gray-200">
    UGOVOR O KUPOPRODAJI UPOTREBLJAVANOG MOTORNOG VOZILA
  </div>

  <p class="mb-4">
    Zaključen u <strong>{{podvuceno mestoZakljucenja 16}}</strong>, dana <strong>{{formatDatum datumZakljucenja}}</strong>, između sledećih ugovornih strana:
  </p>

  <div class="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
    <p class="font-bold text-gray-800 mb-1">1. PRODAVAC:</p>
    <p>
      <strong>{{podvuceno prodavacImePrezime 24}}</strong>, iz mesta <strong>{{podvuceno prodavacMesto 14}}</strong>, 
      adresa <strong>{{podvuceno prodavacAdresa 20}}</strong>, JMBG: <strong>{{podvuceno prodavacJmbg 13}}</strong>, 
      broj lične karte: <strong>{{podvuceno prodavacBrojLk 9}}</strong> izdate od <strong>{{podvuceno prodavacMupLk 14}}</strong>
      (u daljem tekstu: <em>Prodavac</em>).
    </p>
  </div>

  <div class="mb-5 p-3 bg-gray-50 rounded border border-gray-200">
    <p class="font-bold text-gray-800 mb-1">2. KUPAC:</p>
    <p>
      <strong>{{podvuceno kupacImePrezime 24}}</strong>, iz mesta <strong>{{podvuceno kupacMesto 14}}</strong>, 
      adresa <strong>{{podvuceno kupacAdresa 20}}</strong>, JMBG: <strong>{{podvuceno kupacJmbg 13}}</strong>, 
      broj lične karte: <strong>{{podvuceno kupacBrojLk 9}}</strong> izdate od <strong>{{podvuceno kupacMupLk 14}}</strong>
      (u daljem tekstu: <em>Kupac</em>).
    </p>
  </div>

  <div class="text-center font-bold text-sm mb-2 text-gray-800">Član 1. Predmet ugovora</div>
  <p class="mb-2">
    Prodavac prodaje, a Kupac kupuje upotrebljavano motorno vozilo sa sledećim identifikacionim podacima:
  </p>
  <div class="grid grid-cols-2 gap-x-4 gap-y-1 mb-4 p-3 bg-gray-50 rounded border border-gray-200 text-xs sm:text-sm">
    <div><strong>Marka i model:</strong> {{podvuceno voziloMarka 10}} {{podvuceno voziloModel 10}}</div>
    <div><strong>Broj šasije (VIN):</strong> {{podvuceno voziloBrojSasije 17}}</div>
    <div><strong>Broj motora:</strong> {{podvuceno voziloBrojMotora 12}}</div>
    <div><strong>Godina proizvodnje:</strong> {{podvuceno voziloGodina 4}}. god.</div>
    <div><strong>Radna zapremina:</strong> {{podvuceno voziloKubikaza 4}} cm³</div>
    <div><strong>Snaga motora:</strong> {{podvuceno voziloSnagaKw 3}} kW</div>
    <div><strong>Registarska oznaka:</strong> {{podvuceno voziloRegistracija 8}}</div>
    <div><strong>Boja vozila:</strong> {{podvuceno voziloBoja 10}}</div>
  </div>

  <div class="text-center font-bold text-sm mb-2 text-gray-800">Član 2. Kupoprodajna cena i isplata</div>
  <p class="mb-2">
    Ugovorne strane su sporazumno utvrdile kupoprodajnu cenu vozila u iznosu od 
    <strong class="text-blue-900">{{formatIznos cenaIznos}} {{cenaValuta}}</strong> 
    (slovima: <em>{{slovima cenaIznos cenaValuta}}</em>).
  </p>
  <p class="mb-4">
    {{#if (eq nacinPlacanja 'gotovina')}}
    Kupac je ugovorenu kupoprodajnu cenu isplatio Prodavcu u celosti u gotovom novcu na dan potpisivanja ovog ugovora, što Prodavac potvrđuje svojim potpisom na ovom ugovoru i izdaje punovažnu priznanicu.
    {{else if (eq nacinPlacanja 'racun')}}
    Kupac će ugovorenu kupoprodajnu cenu uplatiti na tekući račun Prodavca broj {{podvuceno prodavacTekuciRacun 22}} u roku od {{#if rokPlacanjaDana}}{{rokPlacanjaDana}}{{else}}3{{/if}} dana od dana overe ovog ugovora.
    {{else}}
    Kupac je ugovorenu kupoprodajnu cenu isplatio Prodavcu u celosti u gotovom novcu pre overe ovog ugovora, što Prodavac potvrđuje svojim potpisom.
    {{/if}}
  </p>

  <div class="text-center font-bold text-sm mb-2 text-gray-800">Član 3. Stanje vozila i primopredaja</div>
  <p class="mb-4">
    Kupac izjavljuje da je pre potpisivanja ovog ugovora izvršio detaljan pregled vozila, da mu je stanje u potpunosti poznato i da ga kupuje u viđenom stanju. Prodavac predaje Kupcu vozilo u posed, zajedno sa ključevima i saobraćajnom dozvolom, na dan overe ugovora.
  </p>

  <div class="text-center font-bold text-sm mb-2 text-gray-800">Član 4. Garancija pravne valjanosti</div>
  <p class="mb-4">
    Prodavac garantuje pod punom materijalnom i krivičnom odgovornošću da je isključivi vlasnik vozila, da vozilo nije opterećeno teretima, zalogama niti zabranama otuđenja.
  </p>

  <div class="text-center font-bold text-sm mb-2 text-gray-800">Član 5. Prenos vlasništva i troškovi</div>
  <p class="mb-4">
    Ugovorne strane su saglasne da troškove overe ovog ugovora, porez na prenos apsolutnih prava i registraciju snosi 
    <strong>{{#if (eq troskoveSnosi 'prodavac')}}Prodavac{{else}}Kupac{{/if}}</strong>.
    Kupac se obavezuje da u roku od <strong>30 dana</strong> izvrši prijavu i uplatu poreza i prenese vozilo na svoje ime u MUP-u.
  </p>

  {{#if posebneOdredbe}}
  <div class="text-center font-bold text-sm mb-2 text-gray-800">Član 6. Posebne odredbe</div>
  <p class="mb-4 whitespace-pre-line p-2 bg-yellow-50 rounded border border-yellow-200">
    {{posebneOdredbe}}
  </p>
  {{/if}}

  <div class="text-center font-bold text-sm mb-2 text-gray-800">Član {{#if posebneOdredbe}}7{{else}}6{{/if}}. Završne odredbe</div>
  <p class="mb-8">
    Za sve što nije regulisano primenjivaće se Zakon o obligacionim odnosima RS. Ugovor je sačinjen u 4 (četiri) primerka.
  </p>

  <div class="grid grid-cols-2 gap-6 mt-8 pt-4 border-t border-gray-200">
    <div class="text-center">
      <div class="font-bold mb-8 text-xs text-gray-600">PRODAVAC:</div>
      <div class="border-b border-gray-400 w-3/4 mx-auto mb-1"></div>
      <div class="text-xs text-gray-600">({{prodavacImePrezime}})</div>
    </div>
    <div class="text-center">
      <div class="font-bold mb-8 text-xs text-gray-600">KUPAC:</div>
      <div class="border-b border-gray-400 w-3/4 mx-auto mb-1"></div>
      <div class="text-xs text-gray-600">({{kupacImePrezime}})</div>
    </div>
  </div>
</div>
`;

export default function KupoprodajaVozilaPage() {
  const [pismo, setPismo] = useState<Pismo>('latinica');
  const [generisemPdf, setGenerisemPdf] = useState(false);
  const [aktivniTab, setAktivniTab] = useState<'forma' | 'pregled'>('forma');
  const [otvorenPlacanjeModal, setOtvorenPlacanjeModal] = useState(false);

  const danasDatum = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    mestoZakljucenja: 'Beograd',
    datumZakljucenja: danasDatum,
    prodavacImePrezime: '',
    prodavacMesto: '',
    prodavacAdresa: '',
    prodavacJmbg: '',
    prodavacBrojLk: '',
    prodavacMupLk: '',
    prodavacTekuciRacun: '',
    kupacImePrezime: '',
    kupacMesto: '',
    kupacAdresa: '',
    kupacJmbg: '',
    kupacBrojLk: '',
    kupacMupLk: '',
    voziloMarka: '',
    voziloModel: '',
    voziloBrojSasije: '',
    voziloBrojMotora: '',
    voziloGodina: '',
    voziloKubikaza: '',
    voziloSnagaKw: '',
    voziloRegistracija: '',
    voziloBoja: '',
    cenaIznos: 0,
    cenaValuta: 'RSD',
    nacinPlacanja: 'gotovina',
    rokPlacanjaDana: '3',
    troskoveSnosi: 'kupac',
    posebneOdredbe: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value ? Number(value) : 0) : value,
    }));
  };

  const previewHtml = useMemo(() => {
    try {
      return popuniSablon(SABLON_TEKST, formData, { pismo });
    } catch (e) {
      return '<div class="p-4 text-red-600">Greška pri renderovanju pregleda.</div>';
    }
  }, [formData, pismo]);

  const preuzmiPdfDirektno = async () => {
    try {
      setGenerisemPdf(true);
      const res = await fetch('/api/pdf/kupoprodaja-vozila', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          podaci: formData,
          pismo,
          vodeniZig: false,
        }),
      });

      if (!res.ok) {
        alert('Molimo proverite uneta polja. Sva obavezna polja moraju biti ispravno popunjena.');
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = pismo === 'cirilica' ? 'Ugovor_o_kupoprodaji_vozila_cirilica.pdf' : 'Ugovor_o_kupoprodaji_vozila.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Došlo je do greške pri preuzimanju dokumenta.');
    } finally {
      setGenerisemPdf(false);
      setOtvorenPlacanjeModal(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-[#0E1015] text-slate-300">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/[0.05] bg-[#0E1015]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2.5 text-white">
              <img src="/logo.jpg" alt="doQ-menti" className="w-9 h-9 rounded-lg shadow-lg shadow-indigo-500/20" />
              <span>doQ-menti</span>
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-xs sm:text-sm font-medium truncate max-w-[180px] sm:max-w-md text-slate-400">
              Kupoprodaja vozila
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Pismo toggle */}
            <div className="inline-flex items-center p-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10">
              <button
                type="button"
                onClick={() => setPismo('latinica')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  pismo === 'latinica' ? 'bg-indigo-500 text-white font-bold' : 'text-slate-400'
                }`}
              >
                Latinica
              </button>
              <button
                type="button"
                onClick={() => setPismo('cirilica')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  pismo === 'cirilica' ? 'bg-indigo-500 text-white font-bold' : 'text-slate-400'
                }`}
              >
                Ћирилица
              </button>
            </div>

            <button
              onClick={() => setOtvorenPlacanjeModal(true)}
              className="inline-flex items-center gap-2 font-semibold text-xs sm:text-sm px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/25 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Preuzmi PDF (149 RSD)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero opis + Tab Switcher */}
      <div className="border-b border-white/5 py-6 px-4 sm:px-6 bg-[#0E1015]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Pravno usklađeno (Zakon o obligacionim odnosima)
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {SADRZAJ_KUPOPRODAJA_VOZILA.naziv}
              </h1>
              <p className="text-sm mt-1 max-w-3xl text-slate-400">
                {SADRZAJ_KUPOPRODAJA_VOZILA.kratakOpis} Rok za prenos vlasništva i porez je 30 dana.
              </p>
            </div>

            {/* Mobile Tab Switcher */}
            <div className="flex lg:hidden p-1 rounded-lg text-xs font-medium bg-[#15171E] border border-white/5">
              <button
                onClick={() => setAktivniTab('forma')}
                className={`flex-1 py-2 px-4 rounded-md transition-all font-semibold ${
                  aktivniTab === 'forma' ? 'bg-indigo-500 text-white' : 'text-slate-400'
                }`}
              >
                Formular
              </button>
              <button
                onClick={() => setAktivniTab('pregled')}
                className={`flex-1 py-2 px-4 rounded-md transition-all font-semibold ${
                  aktivniTab === 'pregled' ? 'bg-indigo-500 text-white' : 'text-slate-400'
                }`}
              >
                Živi pregled
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Glavni radni prostor */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEVO: Forma */}
          <div className={`lg:col-span-6 ${aktivniTab === 'pregled' ? 'hidden lg:block' : 'block'}`}>
            <FormaPolja 
              formData={formData} 
              onChange={handleChange}
              onPosebneOdredbeChange={(tekst) => {
                setFormData((prev) => ({ ...prev, posebneOdredbe: tekst }));
              }}
            />
          </div>

          {/* DESNO: Živi pregled */}
          <div className={`lg:col-span-6 ${aktivniTab === 'forma' ? 'hidden lg:block' : 'block'}`}>
            <SablonPreview 
              previewHtml={previewHtml} 
              pismo={pismo} 
              generisemPdf={generisemPdf} 
              onPreuzmiPdf={() => setOtvorenPlacanjeModal(true)} 
            />
          </div>
        </div>

        {/* UPUTSTVO I FAQ SEKCIJA */}
        <div className="mt-16 pt-10 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Šta raditi nakon popunjavanja ugovora?
            </h2>
            <div className="space-y-4">
              {SADRZAJ_KUPOPRODAJA_VOZILA.uputstvo.map((korak) => (
                <div key={korak.korak} className="flex items-start gap-3 bg-[#15171E] p-3.5 rounded-xl border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-indigo-500/20">
                    {korak.korak}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-200">{korak.naslov}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{korak.opis}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              Najčešća pitanja i pravni saveti
            </h2>
            <div className="space-y-3">
              {SADRZAJ_KUPOPRODAJA_VOZILA.faq.map((item, idx) => (
                <div key={idx} className="bg-[#15171E] p-4 rounded-xl border border-white/5">
                  <h3 className="text-xs font-bold text-slate-200 mb-1">{item.pitanje}</h3>
                  <p className="text-xs text-slate-400">{item.odgovor}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Modal za izbor načina plaćanja */}
      {otvorenPlacanjeModal && (
        <PlacanjeModal
          dokumentNaziv={SADRZAJ_KUPOPRODAJA_VOZILA.naziv}
          iznosRsd={SADRZAJ_KUPOPRODAJA_VOZILA.cenaRsd}
          onZatvori={() => setOtvorenPlacanjeModal(false)}
          onZavrseno={preuzmiPdfDirektno}
        />
      )}
    </div>
  );
}
