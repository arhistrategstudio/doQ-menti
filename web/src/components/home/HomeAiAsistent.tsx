'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, User, MapPin, Mail, Phone, RefreshCw, Save, CreditCard, Building } from 'lucide-react';
import Link from 'next/link';

export function HomeAiAsistent() {
  const [podaci, setPodaci] = useState({
    imePrezime: '',
    grad: '',
    opstina: '',
    adresa: '',
    telefon: '',
    email: '',
    brojLk: '',
    mupLk: '',
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
    setPodaci(prev => ({ ...prev, [name]: value }));
    setSacuvano(false);
  };

  const sacuvajPodatke = () => {
    localStorage.setItem('doq_korisnik_osnovno', JSON.stringify(podaci));
    setSacuvano(true);
  };

  const ocistiPodatke = () => {
    localStorage.removeItem('doq_korisnik_osnovno');
    setPodaci({ imePrezime: '', grad: '', opstina: '', adresa: '', email: '', telefon: '', brojLk: '', mupLk: '' });
    setSacuvano(false);
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-500/30 relative overflow-hidden my-8" style={{ background: "linear-gradient(to right, #1A3A2A, #142E21, #0F2319)" }}>
      {/* Glow efekat u pozadini */}
      <div className="absolute -right-20 -top-20 w-72 h-72 bg-[#C9A84C]/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#C9A84C]/20 border border-[#C9A84C]/40 flex items-center justify-center text-[#C9A84C]">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9A84C] uppercase tracking-wider">
                <span>Pametni AI Auto-Fill Asistent</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8F4EE]">
                Unesite osnovne podatke jednom — koristite za sve obrasce
              </h2>
            </div>
          </div>

          <button
            onClick={ocistiPodatke}
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Resetuj</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mb-6 max-w-2xl leading-relaxed">
          Privatnost na prvom mestu: podaci se čuvaju isključivo lokalno u vašem pregledaču (bez JMBG-a) i automatski popunjavaju svaki ugovor ili obrazac koji otvorite. Nakon unosa kliknite na "Sačuvaj profil".
        </p>

        {/* Polja za unos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
          
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <User className="w-3 h-3 text-[#C9A84C]" /> Ime i prezime
            </label>
            <input type="text" name="imePrezime" value={podaci.imePrezime} onChange={handleChange} placeholder="Npr. Petar Petrović" className="w-full text-xs sm:text-sm px-3 py-2 bg-white/90 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#C9A84C] focus:outline-hidden font-medium" />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#C9A84C]" /> Grad / Mesto
            </label>
            <input type="text" name="grad" value={podaci.grad} onChange={handleChange} placeholder="Beograd" className="w-full text-xs sm:text-sm px-3 py-2 bg-white/90 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#C9A84C] focus:outline-hidden font-medium" />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <Building className="w-3 h-3 text-[#C9A84C]" /> Opština
            </label>
            <input type="text" name="opstina" value={podaci.opstina} onChange={handleChange} placeholder="Zvezdara" className="w-full text-xs sm:text-sm px-3 py-2 bg-white/90 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#C9A84C] focus:outline-hidden font-medium" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#C9A84C]" /> Ulica i broj
            </label>
            <input type="text" name="adresa" value={podaci.adresa} onChange={handleChange} placeholder="Knez Mihailova 10" className="w-full text-xs sm:text-sm px-3 py-2 bg-white/90 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#C9A84C] focus:outline-hidden font-medium" />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-[#C9A84C]" /> Broj lične karte
            </label>
            <input type="text" name="brojLk" value={podaci.brojLk} onChange={handleChange} placeholder="123456789" className="w-full text-xs sm:text-sm px-3 py-2 bg-white/90 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#C9A84C] focus:outline-hidden font-medium" />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <Building className="w-3 h-3 text-[#C9A84C]" /> MUP Izdavanja
            </label>
            <input type="text" name="mupLk" value={podaci.mupLk} onChange={handleChange} placeholder="MUP Zvezdara" className="w-full text-xs sm:text-sm px-3 py-2 bg-white/90 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#C9A84C] focus:outline-hidden font-medium" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#C9A84C]" /> Broj telefona
            </label>
            <input type="text" name="telefon" value={podaci.telefon} onChange={handleChange} placeholder="064/1234567" className="w-full text-xs sm:text-sm px-3 py-2 bg-white/90 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#C9A84C] focus:outline-hidden font-medium" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <Mail className="w-3 h-3 text-[#C9A84C]" /> Email adresa
            </label>
            <input type="email" name="email" value={podaci.email} onChange={handleChange} placeholder="petar@email.rs" className="w-full text-xs sm:text-sm px-3 py-2 bg-white/90 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#C9A84C] focus:outline-hidden font-medium" />
          </div>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={sacuvajPodatke}
              className="inline-flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#D5B65F] text-[#1A3A2A] font-bold text-xs sm:text-sm py-2.5 px-6 rounded-xl transition-all shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Sačuvaj profil</span>
            </button>
            {sacuvano && (
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold animate-pulse">
                <CheckCircle2 className="w-4 h-4" /> Sačuvano!
              </span>
            )}
          </div>

          <Link
            href="/obrasci"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm py-2.5 px-6 rounded-xl transition-all"
          >
            <span>Pretraži obrasce</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
