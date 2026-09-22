'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, Download, ArrowLeft, ShieldCheck, 
  Sparkles, CheckCircle2, Building2, User, MapPin, Phone, Mail
} from 'lucide-react';
import { Pismo } from '@/lib/pismo';
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="font-extrabold text-xl tracking-tight text-blue-600 flex items-center gap-1.5">
              <span>do<span className="text-indigo-600">Q</span>-menti</span>
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/obrasci" className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600">
              Obrasci
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Pismo */}
            <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-medium">
              <button
                type="button"
                onClick={() => setPismo('latinica')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  pismo === 'latinica' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                Latinica
              </button>
              <button
                type="button"
                onClick={() => setPismo('cirilica')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  pismo === 'cirilica' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                Ћирилица
              </button>
            </div>

            {/* Dugme za preuzimanje originalnog praznog obrasca */}
            {fajl && (
              <a
                href={`/api/obrasci/preuzmi?izvor=${izvor}&kategorija=${encodeURIComponent(kategorija)}&fajl=${encodeURIComponent(fajl)}`}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-3 py-2 rounded-lg transition-colors border border-slate-300"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Skini prazan original</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-b from-blue-50/70 to-transparent py-8 px-4 sm:px-6 border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/obrasci"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Nazad na katalog obrazaca</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            {kategorija}
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
            {naziv}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Popunite podatke u online formi i preuzmite čist, uredno formatiran zvanični PDF ili preuzmite prazan originalni obrazac.
          </p>
        </div>
      </div>

      {/* Glavni radni prostor */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Sekcija 1: Organ */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Nadležni organ / Ustanova kojoj se podnosi
            </label>
            <input
              type="text"
              name="organKomeSePodnosi"
              value={formData.organKomeSePodnosi}
              onChange={handleChange}
              placeholder="Npr. Ministarstvo unutrašnjih poslova RS / Poreska uprava / Opštinska uprava"
              className="w-full text-sm px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Sekcija 2: Podaci o podnosiocu */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Podaci o podnosiocu (Auto-Fill)
              </label>
              <span className="text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Učitano iz vašeg profila
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ime i prezime / Naziv *</label>
                <input
                  type="text"
                  name="podnosilacIme"
                  value={formData.podnosilacIme}
                  onChange={handleChange}
                  placeholder="Petar Petrović"
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Grad / Mesto *</label>
                <input
                  type="text"
                  name="podnosilacMesto"
                  value={formData.podnosilacMesto}
                  onChange={handleChange}
                  placeholder="Beograd"
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ulica i broj *</label>
                <input
                  type="text"
                  name="podnosilacAdresa"
                  value={formData.podnosilacAdresa}
                  onChange={handleChange}
                  placeholder="Knez Mihailova 10"
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kontakt telefon</label>
                <input
                  type="text"
                  name="podnosilacTelefon"
                  value={formData.podnosilacTelefon}
                  onChange={handleChange}
                  placeholder="064/1234567"
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Sekcija 3: Sadržina zahteva */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Predmet zahteva / Prijave *</label>
              <input
                type="text"
                name="predmetZahteva"
                value={formData.predmetZahteva}
                onChange={handleChange}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Obrazloženje / Tekst zahteva *</label>
              <textarea
                name="obrazlozenje"
                rows={5}
                value={formData.obrazlozenje}
                onChange={handleChange}
                placeholder="Unesite detalje i obrazloženje zahteva koji podnosite..."
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
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
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Dugmad na dnu */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Izbor pisma: <strong>{pismo === 'cirilica' ? 'Ćirilica' : 'Latinica'}</strong>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setOtvorenPlacanjeModal(true)}
                disabled={generisem}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{generisem ? 'Generisanje...' : 'Preuzmi popunjen PDF (149 RSD)'}</span>
              </button>
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
