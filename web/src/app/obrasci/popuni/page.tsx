'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, Download, ArrowLeft, ShieldCheck, 
  Sparkles, CheckCircle2, Building2, User, MapPin, Phone, Mail
} from 'lucide-react';
import { Pismo } from '@/lib/pismo';
import { AiAsistentOdredbe } from '@/components/ai/AiAsistentOdredbe';
import { PlacanjeModal } from '@/components/placanje/PlacanjeModal';

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

  const pdfUrl = `/api/obrasci/preuzmi?izvor=${izvor}&kategorija=${encodeURIComponent(kategorija)}&fajl=${encodeURIComponent(fajl)}`;

  return (
    <div className="min-h-screen bg-[#0E1015] text-slate-300 pb-20">
      {/* Header */}
      <header className="bg-[#0E1015]/70 border-b border-white/[0.05] sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Link href="/" className="font-bold text-xl tracking-tight text-white flex items-center gap-2.5">
              <img src="/logo.jpg" alt="doQ-menti" className="w-9 h-9 rounded-lg shadow-lg shadow-indigo-500/20" />
              <span>doQ-menti</span>
            </Link>
            <span className="text-white/20 hidden sm:inline">/</span>
            <Link href="/obrasci" className="hidden sm:inline text-xs sm:text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors">
              Obrasci
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Pismo */}
            <div className="inline-flex items-center p-1 bg-white/5 rounded-lg border border-white/10 text-xs font-medium">
              <button
                type="button"
                onClick={() => setPismo('latinica')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  pismo === 'latinica' ? 'bg-indigo-500 text-white shadow-xs font-bold' : 'text-slate-400'
                }`}
              >
                Latinica
              </button>
              <button
                type="button"
                onClick={() => setPismo('cirilica')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  pismo === 'cirilica' ? 'bg-indigo-500 text-white shadow-xs font-bold' : 'text-slate-400'
                }`}
              >
                Ћирилица
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-[#0E1015] py-8 px-4 sm:px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/obrasci"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 mb-3 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Nazad na katalog</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-2 border border-indigo-500/20">
            <Building2 className="w-3.5 h-3.5" />
            {kategorija}
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold leading-tight mb-1 text-white">
            {naziv}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Popunite formu uz AI Asistenta i preuzmite PDF, ili pregledajte originalni izgled dokumenta.
          </p>
        </div>
      </div>

      {/* Mobile Tabovi */}
      <div className="sm:hidden flex border-b border-white/5 bg-[#15171E] sticky top-16 z-20">
        <button
          onClick={() => setAktivniTab('formular')}
          className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-colors ${
            aktivniTab === 'formular' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500'
          }`}
        >
          Formular
        </button>
        <button
          onClick={() => setAktivniTab('pregled')}
          className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-colors ${
            aktivniTab === 'pregled' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500'
          }`}
        >
          Originalni dokument
        </button>
      </div>

      {/* Glavni radni prostor */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 pb-24">
        <div className="flex flex-col sm:flex-row gap-6">
          
          {/* LEVA STRANA: Forma */}
          <div className={`w-full sm:w-1/2 lg:w-5/12 space-y-6 ${aktivniTab === 'formular' ? 'block' : 'hidden sm:block'}`}>
          
          {/* Sekcija 1: Organ */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Nadležni organ / Ustanova
            </label>
            <input
              type="text"
              name="organKomeSePodnosi"
              value={formData.organKomeSePodnosi}
              onChange={handleChange}
              placeholder="Npr. MUP RS / Poreska uprava / Opštinska uprava"
              className="w-full text-sm px-4 py-2.5 bg-[#15171E] border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:outline-hidden transition-all"
            />
          </div>

          {/* Sekcija 2: Podaci o podnosiocu */}
          <div className="pt-4 border-t border-white/5">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Podaci o podnosiocu (Auto-Fill)
              </label>
              <span className="text-[11px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full font-medium flex items-center gap-1 border border-indigo-500/20">
                <Sparkles className="w-3 h-3" />
                Učitano iz profila
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Ime i prezime / Naziv *</label>
                <input
                  type="text"
                  name="podnosilacIme"
                  value={formData.podnosilacIme}
                  onChange={handleChange}
                  placeholder="Petar Petrović"
                  className="w-full text-sm px-3 py-2 bg-[#15171E] border border-white/10 rounded-lg text-slate-200 placeholder-slate-600 focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:outline-hidden transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Grad / Mesto *</label>
                <input
                  type="text"
                  name="podnosilacMesto"
                  value={formData.podnosilacMesto}
                  onChange={handleChange}
                  placeholder="Beograd"
                  className="w-full text-sm px-3 py-2 bg-[#15171E] border border-white/10 rounded-lg text-slate-200 placeholder-slate-600 focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:outline-hidden transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Ulica i broj *</label>
                <input
                  type="text"
                  name="podnosilacAdresa"
                  value={formData.podnosilacAdresa}
                  onChange={handleChange}
                  placeholder="Knez Mihailova 10"
                  className="w-full text-sm px-3 py-2 bg-[#15171E] border border-white/10 rounded-lg text-slate-200 placeholder-slate-600 focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:outline-hidden transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Kontakt telefon</label>
                <input
                  type="text"
                  name="podnosilacTelefon"
                  value={formData.podnosilacTelefon}
                  onChange={handleChange}
                  placeholder="064/1234567"
                  className="w-full text-sm px-3 py-2 bg-[#15171E] border border-white/10 rounded-lg text-slate-200 placeholder-slate-600 focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:outline-hidden transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* Sekcija 3: Sadržina zahteva */}
          <div className="pt-4 border-t border-white/5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Predmet zahteva / Prijave *</label>
              <input
                type="text"
                name="predmetZahteva"
                value={formData.predmetZahteva}
                onChange={handleChange}
                className="w-full text-sm px-3 py-2 bg-[#15171E] border border-white/10 rounded-lg text-slate-200 focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:outline-hidden transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Obrazloženje / Tekst zahteva *</span>
              </label>
              <textarea
                name="obrazlozenje"
                rows={5}
                value={formData.obrazlozenje}
                onChange={handleChange}
                placeholder="Unesite detalje i obrazloženje zahteva koji podnosite..."
                className="w-full text-sm px-3 py-2 bg-[#15171E] border border-white/10 rounded-lg text-slate-200 placeholder-slate-600 focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:outline-hidden transition-all"
              />
              <AiAsistentOdredbe 
                trenutniUnos={formData.obrazlozenje}
                onPrimeni={(tekst) => setFormData(prev => ({...prev, obrazlozenje: tekst}))}
                kontekst={naziv}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Prilozi uz zahtev (opciono)</label>
              <textarea
                name="prilozi"
                rows={2}
                value={formData.prilozi}
                onChange={handleChange}
                placeholder="Npr. 1. Očitana lična karta, 2. Dokaz o uplati takse, 3. Uverenje..."
                className="w-full text-sm px-3 py-2 bg-[#15171E] border border-white/10 rounded-lg text-slate-200 placeholder-slate-600 focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Dugmad na dnu */}
          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Izbor pisma: <strong className="text-slate-300">{pismo === 'cirilica' ? 'Ćirilica' : 'Latinica'}</strong>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setOtvorenPlacanjeModal(true)}
                disabled={generisem}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{generisem ? 'Generisanje...' : 'Preuzmi popunjen PDF (149 RSD)'}</span>
              </button>
            </div>
          </div>

          </div>

          {/* DESNA STRANA: Prikaz originalnog dokumenta */}
          <div className={`w-full sm:w-1/2 lg:w-7/12 ${aktivniTab === 'pregled' ? 'block' : 'hidden sm:block'}`}>
            <div className="bg-[#15171E] rounded-xl border border-white/5 shadow-2xl overflow-hidden h-[800px] flex flex-col">
              <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Originalni izgled dokumenta</span>
                </div>
                {fajl && (
                  <a
                    href={`${pdfUrl}&download=1`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                    download
                  >
                    <Download className="w-3.5 h-3.5" /> Skini prazan
                  </a>
                )}
              </div>
              <div className="flex-1 bg-slate-900 relative">
                {fajl ? (
                  <iframe 
                    src={pdfUrl + '#toolbar=0&navpanes=0'} 
                    className="w-full h-full border-none"
                    title="Prikaz originalnog dokumenta"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                    Prikaz originalnog dokumenta nije dostupan
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
          onZavrseno={preuzmiPopunjenPdf}
        />
      )}
    </div>
  );
}

export default function PopuniObrazacPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Učitavanje forme...</div>}>
      <PopuniObrazacContent />
    </Suspense>
  );
}
