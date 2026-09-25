'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, Download, ArrowLeft, ShieldCheck, 
  Sparkles, CheckCircle2, Building2, User, MapPin, Phone, Mail
} from 'lucide-react';
import { Pismo } from '@/lib/pismo';
import { AiAsistentOdredbe } from '@/components/ai/AiAsistentOdredbe';
import { PlacanjeModal } from '@/components/placanje/PlacanjeModal';
import { PdfPopunjiviPrikaz, type PdfPopunjiviHandle } from '@/components/obrasci/PdfPopunjiviPrikaz';

function PopuniObrazacContent() {
  const searchParams = useSearchParams();
  const naziv = searchParams.get('naziv') || 'Zvanični obrazac / Zahtev';
  const kategorija = searchParams.get('kategorija') || 'Opšti obrasci';
  const fajl = searchParams.get('fajl') || '';
  const izvor = searchParams.get('izvor') || 'paragraf';

  const [pismo, setPismo] = useState<Pismo>('latinica');
  const [generisem, setGenerisem] = useState(false);
  const [otvorenPlacanjeModal, setOtvorenPlacanjeModal] = useState(false);
  const [aktivniTab, setAktivniTab] = useState<'formular' | 'pregled'>('formular');
  // null = još se učitava; true = original ima polja i popunjava se direktno u dokumentu
  const [imaPolja, setImaPolja] = useState<boolean | null>(null);
  const [greskaPrikaza, setGreskaPrikaza] = useState(false);
  const pdfRef = useRef<PdfPopunjiviHandle>(null);
  const jePdf = fajl.toLowerCase().endsWith('.pdf');

  const [formData, setFormData] = useState({
    podnosilacIme: '',
    podnosilacMesto: '',
    podnosilacAdresa: '',
    podnosilacTelefon: '',
    podnosilacEmail: '',
    organKomeSePodnosi: '',
    predmetZahteva: naziv,
    obrazlozenje: '',
    prilozi: '',
    mesto: 'Beograd',
    datum: new Date().toISOString().split('T')[0],
  });

  // Učitavanje iz lokalnog AI Auto-Fill profila
  useEffect(() => {
    const sacuvani = localStorage.getItem('doq_korisnik_osnovno');
    if (sacuvani) {
      try {
        const profil = JSON.parse(sacuvani);
        // Podaci iz localStorage su dostupni tek na klijentu, pa se učitavaju posle prvog rendera.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData((prev) => ({
          ...prev,
          podnosilacIme: profil.imePrezime || prev.podnosilacIme,
          podnosilacMesto: profil.grad || prev.podnosilacMesto,
          podnosilacAdresa: profil.adresa || prev.podnosilacAdresa,
          podnosilacTelefon: profil.telefon || prev.podnosilacTelefon,
          podnosilacEmail: profil.email || prev.podnosilacEmail,
          mesto: profil.grad || prev.mesto,
        }));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const preuzmiPopunjenPdf = async () => {
    try {
      setGenerisem(true);
      const res = await fetch('/api/pdf/generisi-univerzalni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nazivObrasca: naziv,
          kategorija,
          podaci: formData,
          pismo,
        }),
      });

      if (!res.ok) {
        alert('Greška pri generisanju obrasca.');
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${naziv.slice(0, 30)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Došlo je do greške.');
    } finally {
      setGenerisem(false);
      setOtvorenPlacanjeModal(false);
    }
  };

  // Upisuje vrednosti u ORIGINALNI PDF na serveru — preuzeti dokument izgleda isto kao original.
  const preuzmiPopunjenOriginal = async () => {
    try {
      setGenerisem(true);
      const vrednosti = (await pdfRef.current?.vrednosti()) || {};
      const res = await fetch('/api/obrasci/popuni-original', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ izvor, kategorija, fajl, vrednosti }),
      });
      if (!res.ok) {
        alert('Greška pri popunjavanju obrasca.');
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fajl.replace(/\.pdf$/i, '')}_popunjen.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Došlo je do greške.');
    } finally {
      setGenerisem(false);
      setOtvorenPlacanjeModal(false);
    }
  };

  const pdfUrl = `/api/obrasci/preuzmi?izvor=${izvor}&kategorija=${encodeURIComponent(kategorija)}&fajl=${encodeURIComponent(fajl)}`;

  return (
    <div className="relative min-h-screen pb-20" style={{ color: "#F8F4EE" }}>
      <div className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/background-doc.jpg')" }} />
      <div className="fixed inset-0 -z-10" style={{ background: "linear-gradient(180deg, rgba(10,18,13,0.90) 0%, rgba(10,18,13,0.86) 50%, rgba(10,18,13,0.94) 100%)" }} />
      {/* Header */}
      <header className="bg-[rgba(26,58,42,0.55)] backdrop-blur-md border-b border-[#C9A84C]/20 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="font-extrabold text-xl tracking-tight text-[#F8F4EE] flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
              <span>do<span className="text-[#C9A84C]">Q</span>-menti</span>
            </Link>
            <span className="text-[rgba(248,244,238,0.6)] hidden sm:inline">/</span>
            <Link href="/obrasci" className="hidden sm:inline text-xs sm:text-sm font-semibold text-slate-300 hover:text-[#C9A84C]">
              Obrasci
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Pismo */}
            <div className="inline-flex items-center p-1 bg-white/10 rounded-lg border border-white/20 text-xs font-medium">
              <button
                type="button"
                onClick={() => setPismo('latinica')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  pismo === 'latinica' ? 'bg-[#C9A84C] text-[#1A3A2A] shadow-xs font-bold' : 'text-slate-300'
                }`}
              >
                Latinica
              </button>
              <button
                type="button"
                onClick={() => setPismo('cirilica')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  pismo === 'cirilica' ? 'bg-[#C9A84C] text-[#1A3A2A] shadow-xs font-bold' : 'text-slate-300'
                }`}
              >
                Ћирилица
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-b from-[#1A3A2A] to-[#142E21] py-8 px-4 sm:px-6 border-b border-[#C9A84C]/20 text-[#F8F4EE]">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/obrasci"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C9A84C] hover:underline mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Nazad na katalog obrazaca</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C9A84C]/20 text-[#C9A84C] text-xs font-semibold mb-2 border border-[#C9A84C]/30">
            <Building2 className="w-3.5 h-3.5" />
            {kategorija}
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold leading-tight mb-1">
            {naziv}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Popunite formu uz AI Asistenta i preuzmite PDF, ili pregledajte originalni izgled dokumenta.
          </p>
        </div>
      </div>

      {/* Mobile Tabovi */}
      {imaPolja !== true && (
      <div className="sm:hidden flex border-b border-[#C9A84C]/20 bg-[rgba(20,46,33,0.85)] backdrop-blur-md sticky top-16 z-20">
        <button
          onClick={() => setAktivniTab('formular')}
          className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-colors ${
            aktivniTab === 'formular' ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-transparent text-[rgba(248,244,238,0.6)]'
          }`}
        >
          Formular
        </button>
        <button
          onClick={() => setAktivniTab('pregled')}
          className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-colors ${
            aktivniTab === 'pregled' ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-transparent text-[rgba(248,244,238,0.6)]'
          }`}
        >
          Originalni dokument
        </button>
      </div>
      )}

      {/* Glavni radni prostor */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 pb-24">
        <div className="flex flex-col sm:flex-row gap-6">
          
          {/* LEVA STRANA: Forma */}
          <div className={`w-full sm:w-1/2 lg:w-5/12 space-y-6 ${imaPolja === true ? 'hidden' : aktivniTab === 'formular' ? 'block' : 'hidden sm:block'}`}>
          
          {/* Sekcija 1: Organ */}
          <div>
            <label className="block text-xs font-bold text-[#F8F4EE] uppercase tracking-wider mb-2">
              Nadležni organ / Ustanova kojoj se podnosi
            </label>
            <input
              type="text"
              name="organKomeSePodnosi"
              value={formData.organKomeSePodnosi}
              onChange={handleChange}
              placeholder="Npr. Ministarstvo unutrašnjih poslova RS / Poreska uprava / Opštinska uprava"
              className="w-full text-sm px-4 py-2.5 border border-[rgba(201,168,76,0.30)] bg-[rgba(20,46,33,0.55)] text-[#F8F4EE] placeholder:text-[#AEBAAE] rounded-xl focus:ring-2 focus:ring-[#C9A84C] focus:outline-hidden"
            />
          </div>

          {/* Sekcija 2: Podaci o podnosiocu */}
          <div className="pt-4 border-t border-[rgba(248,244,238,0.12)]">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-xs font-bold text-[#F8F4EE] uppercase tracking-wider">
                Podaci o podnosiocu (Auto-Fill)
              </label>
              <span className="text-[11px] text-[#C9A84C] bg-[rgba(201,168,76,0.15)] px-2 py-0.5 rounded font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Učitano iz vašeg profila
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[rgba(248,244,238,0.85)] mb-1">Ime i prezime / Naziv *</label>
                <input
                  type="text"
                  name="podnosilacIme"
                  value={formData.podnosilacIme}
                  onChange={handleChange}
                  placeholder="Petar Petrović"
                  className="w-full text-sm px-3 py-2 border border-[rgba(201,168,76,0.30)] bg-[rgba(20,46,33,0.55)] text-[#F8F4EE] placeholder:text-[#AEBAAE] rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[rgba(248,244,238,0.85)] mb-1">Grad / Mesto *</label>
                <input
                  type="text"
                  name="podnosilacMesto"
                  value={formData.podnosilacMesto}
                  onChange={handleChange}
                  placeholder="Beograd"
                  className="w-full text-sm px-3 py-2 border border-[rgba(201,168,76,0.30)] bg-[rgba(20,46,33,0.55)] text-[#F8F4EE] placeholder:text-[#AEBAAE] rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[rgba(248,244,238,0.85)] mb-1">Ulica i broj *</label>
                <input
                  type="text"
                  name="podnosilacAdresa"
                  value={formData.podnosilacAdresa}
                  onChange={handleChange}
                  placeholder="Knez Mihailova 10"
                  className="w-full text-sm px-3 py-2 border border-[rgba(201,168,76,0.30)] bg-[rgba(20,46,33,0.55)] text-[#F8F4EE] placeholder:text-[#AEBAAE] rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[rgba(248,244,238,0.85)] mb-1">Kontakt telefon</label>
                <input
                  type="text"
                  name="podnosilacTelefon"
                  value={formData.podnosilacTelefon}
                  onChange={handleChange}
                  placeholder="064/1234567"
                  className="w-full text-sm px-3 py-2 border border-[rgba(201,168,76,0.30)] bg-[rgba(20,46,33,0.55)] text-[#F8F4EE] placeholder:text-[#AEBAAE] rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[rgba(248,244,238,0.85)] mb-1">Email adresa</label>
                <input
                  type="email"
                  name="podnosilacEmail"
                  value={formData.podnosilacEmail}
                  onChange={handleChange}
                  placeholder="petar@email.rs"
                  className="w-full text-sm px-3 py-2 border border-[rgba(201,168,76,0.30)] bg-[rgba(20,46,33,0.55)] text-[#F8F4EE] placeholder:text-[#AEBAAE] rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Sekcija 3: Sadržina zahteva */}
          <div className="pt-4 border-t border-[rgba(248,244,238,0.12)] space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[rgba(248,244,238,0.85)] mb-1">Predmet zahteva / Prijave *</label>
              <input
                type="text"
                name="predmetZahteva"
                value={formData.predmetZahteva}
                onChange={handleChange}
                className="w-full text-sm px-3 py-2 border border-[rgba(201,168,76,0.30)] bg-[rgba(20,46,33,0.55)] text-[#F8F4EE] placeholder:text-[#AEBAAE] rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[rgba(248,244,238,0.85)] mb-1 flex items-center justify-between">
                <span>Obrazloženje / Tekst zahteva *</span>
              </label>
              <textarea
                name="obrazlozenje"
                rows={5}
                value={formData.obrazlozenje}
                onChange={handleChange}
                placeholder="Unesite detalje i obrazloženje zahteva koji podnosite..."
                className="w-full text-sm px-3 py-2 border border-[rgba(201,168,76,0.30)] bg-[rgba(20,46,33,0.55)] text-[#F8F4EE] placeholder:text-[#AEBAAE] rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:outline-hidden"
              />
              <AiAsistentOdredbe 
                trenutniUnos={formData.obrazlozenje}
                onPrimeni={(tekst) => setFormData(prev => ({...prev, obrazlozenje: tekst}))}
                kontekst={naziv}
                pismo={pismo}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[rgba(248,244,238,0.85)] mb-1">Prilozi uz zahtev (opciono)</label>
              <textarea
                name="prilozi"
                rows={2}
                value={formData.prilozi}
                onChange={handleChange}
                placeholder="Npr. 1. Očitana lična karta, 2. Dokaz o uplati takse, 3. Uverenje..."
                className="w-full text-sm px-3 py-2 border border-[rgba(201,168,76,0.30)] bg-[rgba(20,46,33,0.55)] text-[#F8F4EE] placeholder:text-[#AEBAAE] rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Dugmad na dnu */}
          <div className="pt-6 border-t border-[rgba(248,244,238,0.12)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[rgba(248,244,238,0.6)]">
              Izbor pisma: <strong>{pismo === 'cirilica' ? 'Ćirilica' : 'Latinica'}</strong>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setOtvorenPlacanjeModal(true)}
                disabled={generisem}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#D5B65F] text-[#1A3A2A] font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{generisem ? 'Generisanje...' : 'Preuzmi popunjen PDF'}</span>
              </button>
            </div>
          </div>

          </div>

          {/* DESNA STRANA: Prikaz originalnog dokumenta */}
          <div className={imaPolja === true ? 'w-full' : `w-full sm:w-1/2 lg:w-7/12 ${aktivniTab === 'pregled' ? 'block' : 'hidden sm:block'}`}>
            <div className="bg-[rgba(20,46,33,0.45)] backdrop-blur-sm rounded-xl border border-[rgba(201,168,76,0.25)] shadow-lg overflow-hidden h-[800px] flex flex-col">
              <div className="bg-[rgba(20,46,33,0.6)] px-4 py-3 border-b border-[rgba(201,168,76,0.2)] flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-[rgba(248,244,238,0.85)]">
                  <FileText className="w-4 h-4 text-[#C9A84C]" />
                  <span>{imaPolja === true ? 'Popunite polja direktno u dokumentu' : 'Originalni izgled dokumenta'}</span>
                </div>
                {imaPolja === true && (
                  <button
                    onClick={() => setOtvorenPlacanjeModal(true)}
                    disabled={generisem}
                    className="inline-flex items-center gap-1.5 bg-[#C9A84C] hover:bg-[#D5B65F] text-[#1A3A2A] font-bold text-xs px-3 py-1.5 rounded-lg"
                  >
                    <Download className="w-3.5 h-3.5" /> {generisem ? 'Generisanje...' : 'Preuzmi popunjen PDF'}
                  </button>
                )}
                {fajl && (
                  <a
                    href={`${pdfUrl}&download=1`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C9A84C] hover:opacity-80"
                    download
                  >
                    <Download className="w-3.5 h-3.5" /> Skini prazan
                  </a>
                )}
              </div>
              <div className="flex-1 bg-[rgba(10,18,13,0.35)] relative">
                {jePdf && !greskaPrikaza ? (
                  <PdfPopunjiviPrikaz
                    ref={pdfRef}
                    url={pdfUrl}
                    onUcitano={setImaPolja}
                    onGreska={() => setGreskaPrikaza(true)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center gap-4 p-6" style={{ color: "rgba(248,244,238,0.7)" }}>
                    <FileText className="w-10 h-10" style={{ color: "#C9A84C" }} />
                    <div className="text-sm max-w-xs">
                      {greskaPrikaza
                        ? 'Prikaz dokumenta nije uspeo. Skinite prazan original ili popunite formu levo.'
                        : fajl
                        ? `Ovaj obrazac je u formatu ${fajl.split('.').pop()?.toUpperCase()} i ne moze da se prikaze u pregledu. Popunite formu levo pa preuzmite gotov PDF, ili skinite prazan original.`
                        : "Prikaz originalnog dokumenta nije dostupan."}
                    </div>
                    {fajl && (
                      <a href={`${pdfUrl}&download=1`} download className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg" style={{ backgroundColor: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.35)" }}>
                        <Download className="w-3.5 h-3.5" /> Preuzmi prazan original
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {otvorenPlacanjeModal && (
        <PlacanjeModal
          dokumentNaziv={naziv}
          iznosRsd={149}
          onZatvori={() => setOtvorenPlacanjeModal(false)}
          onZavrseno={imaPolja === true ? preuzmiPopunjenOriginal : preuzmiPopunjenPdf}
        />
      )}
    </div>
  );
}

export default function PopuniObrazacPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-[rgba(248,244,238,0.6)]">Učitavanje forme...</div>}>
      <PopuniObrazacContent />
    </Suspense>
  );
}
