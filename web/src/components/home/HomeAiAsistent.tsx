'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, User, MapPin, Mail, Phone, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export function HomeAiAsistent() {
  const [korak, setKorak] = useState(1);
  const [podaci, setPodaci] = useState({
    imePrezime: '',
    grad: '',
    adresa: '',
    email: '',
    telefon: '',
  });
  const [sacuvano, setSacuvano] = useState(false);

  useEffect(() => {
    const sacuvaniPodaci = localStorage.getItem('doq_korisnik_osnovno');
    if (sacuvaniPodaci) {
      try {
        setPodaci(JSON.parse(sacuvaniPodaci));
        setSacuvano(true);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const novi = { ...podaci, [name]: value };
    setPodaci(novi);
    localStorage.setItem('doq_korisnik_osnovno', JSON.stringify(novi));
    setSacuvano(true);
  };

  const ocistiPodatke = () => {
    localStorage.removeItem('doq_korisnik_osnovno');
    setPodaci({ imePrezime: '', grad: '', adresa: '', email: '', telefon: '' });
    setSacuvano(false);
    setKorak(1);
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-500/30 relative overflow-hidden my-8">
      {/* Glow efekat u pozadini */}
      <div className="absolute -right-20 -top-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 uppercase tracking-wider">
                <span>Pametni AI Auto-Fill Asistent</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Unesite osnovne podatke jednom — koristite za sve obrasce
              </h2>
            </div>
          </div>

          {sacuvano && (
            <button
              onClick={ocistiPodatke}
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors self-start md:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Resetuj podatke</span>
            </button>
          )}
        </div>

        <p className="text-xs sm:text-sm text-blue-100/80 mb-6 max-w-2xl leading-relaxed">
          Privatnost na prvom mestu: podaci se čuvaju isključivo lokalno u vašem pregledaču (bez JMBG-a) i automatski popunjavaju svaki ugovor ili obrazac koji otvorite.
        </p>

        {/* Polja za unos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 bg-white/10 p-4 rounded-2xl border border-white/15 backdrop-blur-xs">
          <div>
            <label className="block text-[11px] font-semibold text-blue-200 mb-1 flex items-center gap-1">
              <User className="w-3 h-3 text-blue-300" />
              Ime i prezime
            </label>
            <input
              type="text"
              name="imePrezime"
              value={podaci.imePrezime}
              onChange={handleChange}
              placeholder="Npr. Petar Petrović"
              className="w-full text-xs sm:text-sm px-3 py-2 bg-white/90 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-400 focus:outline-hidden font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-blue-200 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-blue-300" />
              Grad / Mesto
            </label>
            <input
              type="text"
              name="grad"
              value={podaci.grad}
              onChange={handleChange}
              placeholder="Npr. Beograd"
              className="w-full text-xs sm:text-sm px-3 py-2 bg-white/90 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-400 focus:outline-hidden font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-blue-200 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-blue-300" />
              Ulica i broj
            </label>
            <input
              type="text"
              name="adresa"
              value={podaci.adresa}
              onChange={handleChange}
              placeholder="Npr. Knez Mihailova 10"
              className="w-full text-xs sm:text-sm px-3 py-2 bg-white/90 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-400 focus:outline-hidden font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-blue-200 mb-1 flex items-center gap-1">
              <Phone className="w-3 h-3 text-blue-300" />
              Broj telefona (opciono)
            </label>
            <input
              type="text"
              name="telefon"
              value={podaci.telefon}
              onChange={handleChange}
              placeholder="Npr. 064/1234567"
              className="w-full text-xs sm:text-sm px-3 py-2 bg-white/90 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-400 focus:outline-hidden font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-blue-200 mb-1 flex items-center gap-1">
              <Mail className="w-3 h-3 text-blue-300" />
              Email adresa (opciono)
            </label>
            <input
              type="email"
              name="email"
              value={podaci.email}
              onChange={handleChange}
              placeholder="Npr. petar@email.rs"
              className="w-full text-xs sm:text-sm px-3 py-2 bg-white/90 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-400 focus:outline-hidden font-medium"
            />
          </div>

          <div className="flex items-end">
            <Link
              href="/ugovori/kupoprodaja-vozila"
              className="w-full inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs sm:text-sm py-2 px-4 rounded-xl transition-all shadow-md"
            >
              <span>Primeni & Popuni ugovor</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {sacuvano && podaci.imePrezime && (
          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-300 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Podaci su sačuvani i automatski se popunjavaju u formama.</span>
          </div>
        )}

      </div>
    </div>
  );
}
