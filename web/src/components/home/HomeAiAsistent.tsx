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
    <div className="bg-[#15171E] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 relative overflow-hidden my-8 group">
      {/* Glow efekat u pozadini */}
      <div className="absolute -right-20 -top-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform duration-500">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider mb-1">
                <span>AI Auto-Fill Engine</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Globalni podaci korisnika
              </h2>
            </div>
          </div>

          <button
            onClick={ocistiPodatke}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 px-3 py-1.5 rounded-lg transition-all self-start md:self-auto font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Cache</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-2xl leading-relaxed">
          Privatnost na prvom mestu: state se čuva isključivo lokalno u vašem pregledaču (bez JMBG-a) i injektuje se automatski u sve forme. Sačuvajte profil za globalni auto-fill.
        </p>

        {/* Polja za unos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-[#0E1015]/50 p-5 rounded-2xl border border-white/5 backdrop-blur-md">
          
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" /> fullName
            </label>
            <input type="text" name="imePrezime" value={podaci.imePrezime} onChange={handleChange} placeholder="String (e.g. Petar Petrović)" className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white/5 text-slate-200 rounded-xl border border-white/5 focus:bg-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:outline-hidden font-medium placeholder-slate-600 transition-all" />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" /> city
            </label>
            <input type="text" name="grad" value={podaci.grad} onChange={handleChange} placeholder="Beograd" className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white/5 text-slate-200 rounded-xl border border-white/5 focus:bg-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:outline-hidden font-medium placeholder-slate-600 transition-all" />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-indigo-400" /> municipality
            </label>
            <input type="text" name="opstina" value={podaci.opstina} onChange={handleChange} placeholder="Zvezdara" className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white/5 text-slate-200 rounded-xl border border-white/5 focus:bg-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:outline-hidden font-medium placeholder-slate-600 transition-all" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" /> address
            </label>
            <input type="text" name="adresa" value={podaci.adresa} onChange={handleChange} placeholder="Knez Mihailova 10" className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white/5 text-slate-200 rounded-xl border border-white/5 focus:bg-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:outline-hidden font-medium placeholder-slate-600 transition-all" />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-indigo-400" /> idNumber
            </label>
            <input type="text" name="brojLk" value={podaci.brojLk} onChange={handleChange} placeholder="123456789" className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white/5 text-slate-200 rounded-xl border border-white/5 focus:bg-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:outline-hidden font-medium placeholder-slate-600 transition-all" />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-indigo-400" /> idIssuer
            </label>
            <input type="text" name="mupLk" value={podaci.mupLk} onChange={handleChange} placeholder="MUP Zvezdara" className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white/5 text-slate-200 rounded-xl border border-white/5 focus:bg-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:outline-hidden font-medium placeholder-slate-600 transition-all" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-indigo-400" /> phone
            </label>
            <input type="text" name="telefon" value={podaci.telefon} onChange={handleChange} placeholder="064/1234567" className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white/5 text-slate-200 rounded-xl border border-white/5 focus:bg-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:outline-hidden font-medium placeholder-slate-600 transition-all" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" /> email
            </label>
            <input type="email" name="email" value={podaci.email} onChange={handleChange} placeholder="petar@email.rs" className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white/5 text-slate-200 rounded-xl border border-white/5 focus:bg-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:outline-hidden font-medium placeholder-slate-600 transition-all" />
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={sacuvajPodatke}
              className="inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs sm:text-sm py-2.5 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)]"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile State</span>
            </button>
            {sacuvano && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <CheckCircle2 className="w-4 h-4" /> State Synced
              </span>
            )}
          </div>

          <Link
            href="/obrasci"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs sm:text-sm py-2.5 px-6 rounded-xl transition-all"
          >
            <span>Browse API</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
