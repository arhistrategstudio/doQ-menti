'use client';

import React, { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Folder, FileText, Download, Search, ChevronRight, 
  ArrowLeft, Building2, Shield, Layers, Edit3
} from 'lucide-react';
import allCategories from '@/data/katalog-obrazaca.json';

function ObrasciSadrzaj() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [pretraga, setPretraga] = useState(initialQuery);
  const [izabranaKategorija, setIzabranaKategorija] = useState<string | null>(null);

  useEffect(() => {
    if (initialQuery) {
      setPretraga(initialQuery);
    }
  }, [initialQuery]);

  const filtriraniPodaci = useMemo(() => {
    const q = pretraga.toLowerCase().trim();
    if (!q) return allCategories;
    return allCategories
      .map((kat: any) => {
        const odgovaraNazivKategorije = kat.name.toLowerCase().includes(q);
        const filtriraniObrasci = kat.items.filter((item: any) =>
          item.title.toLowerCase().includes(q) || item.file.toLowerCase().includes(q)
        );
        if (odgovaraNazivKategorije || filtriraniObrasci.length > 0) {
          return {
            ...kat,
            count: filtriraniObrasci.length,
            items: filtriraniObrasci.length > 0 ? filtriraniObrasci : kat.items,
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [pretraga]);

  const aktivnaKategorijaObj = useMemo(() => {
    if (!izabranaKategorija) return null;
    return allCategories.find((k: any) => k.name === izabranaKategorija) || null;
  }, [izabranaKategorija]);

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
              Katalog (2.294)
            </span>
          </div>

          <Link
            href="/"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            ← Početna
          </Link>
        </div>
      </header>

      {/* Hero i Pretraga */}
      <div className="py-10 px-4 sm:px-6 border-b border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300">
            <Layers className="w-3.5 h-3.5" />
            67 kategorija • 2.294 zvanična obrasca
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Katalog svih obrazaca
          </h1>
          <p className="text-xs sm:text-sm max-w-2xl mx-auto text-slate-400">
            Popunite obrazac online sa AI auto-fill ili preuzmite prazan originalni fajl.
          </p>

          <div className="relative max-w-2xl mx-auto mt-6 group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur-sm opacity-10 group-hover:opacity-30 transition duration-500"></div>
            <div className="relative flex items-center bg-[#15171E] border border-white/10 rounded-xl overflow-hidden">
              <Search className="w-5 h-5 ml-4 text-slate-500" />
              <input
                type="text"
                value={pretraga}
                onChange={(e) => {
                  setPretraga(e.target.value);
                  setIzabranaKategorija(null);
                }}
                placeholder="Pretražite obrazac po nazivu..."
                className="w-full bg-transparent text-sm text-white px-4 py-3.5 focus:outline-hidden placeholder-slate-500 font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sadržaj */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {izabranaKategorija && aktivnaKategorijaObj ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIzabranaKategorija(null)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sve kategorije</span>
              </button>
              <div className="text-xs text-slate-500">
                Ukupno: <strong className="text-slate-300">{aktivnaKategorijaObj.items.length}</strong>
              </div>
            </div>

            <div className="bg-[#15171E] rounded-2xl border border-white/5 p-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/5 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <Folder className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{aktivnaKategorijaObj.name}</h2>
                  <p className="text-xs text-slate-500">Popunite online ili preuzmite prazan</p>
                </div>
              </div>

              <div className="divide-y divide-white/5">
                {aktivnaKategorijaObj.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] px-3 rounded-xl transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-200 leading-snug">{item.title}</div>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                          <span className="font-mono bg-white/5 px-1.5 py-0.5 rounded text-slate-400 font-semibold">
                            {item.file.split('.').pop()?.toUpperCase()}
                          </span>
                          <span>{item.source}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                      <Link
                        href={`/obrasci/popuni?naziv=${encodeURIComponent(item.title)}&kategorija=${encodeURIComponent(aktivnaKategorijaObj.name)}&fajl=${encodeURIComponent(item.file)}&izvor=${item.source}`}
                        className="inline-flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Popuni</span>
                      </Link>

                      <a
                        href={`/api/obrasci/preuzmi?izvor=${item.source}&kategorija=${encodeURIComponent(aktivnaKategorijaObj.name)}&fajl=${encodeURIComponent(item.file)}&download=1`}
                        className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs px-3 py-2 rounded-lg transition-colors border border-white/10"
                        title="Preuzmite prazan originalni obrazac"
                        download
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Prazan</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtriraniPodaci.map((kat: any) => (
                <div
                  key={kat.name}
                  onClick={() => setIzabranaKategorija(kat.name)}
                  className="bg-[#13151A] rounded-xl border border-white/5 p-5 hover:border-indigo-500/50 hover:bg-[#1A1D24] transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/5 text-slate-400 flex items-center justify-center group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-colors">
                        <Folder className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-slate-200 line-clamp-1 group-hover:text-white transition-colors">
                          {kat.name}
                        </h3>
                        <span className="text-[10px] font-mono text-slate-500">{kat.count} docs</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function ObrasciKatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Učitavanje...</div>}>
      <ObrasciSadrzaj />
    </Suspense>
  );
}
