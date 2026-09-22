'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Folder, FileText, Download, Search, ChevronRight, 
  ArrowLeft, Building2, Shield, Layers, Edit3
} from 'lucide-react';
import allCategories from '@/data/katalog-obrazaca.json';

export default function ObrasciKatalogPage() {
  const [pretraga, setPretraga] = useState('');
  const [izabranaKategorija, setIzabranaKategorija] = useState<string | null>(null);

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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="font-extrabold text-xl tracking-tight text-blue-600 flex items-center gap-1.5">
              <span>do<span className="text-indigo-600">Q</span>-menti</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-700">
              Katalog svih obrazaca (2.294)
            </span>
          </div>

          <Link
            href="/"
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            ← Nazad na početnu
          </Link>
        </div>
      </header>

      {/* Hero i Pretraga */}
      <div className="bg-gradient-to-b from-blue-50/70 to-transparent py-10 px-4 sm:px-6 border-b border-slate-200/70">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            67 kategorija • 2.294 zvanična obrasca
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Katalog svih preuzetih i državnih obrazaca
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Izaberite opciju: popunite obrazac online u aplikaciji sa automatskim ispisom ili preuzmite čist, prazan originalni fajl.
          </p>

          <div className="relative max-w-2xl mx-auto mt-6">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={pretraga}
              onChange={(e) => {
                setPretraga(e.target.value);
                setIzabranaKategorija(null);
              }}
              placeholder="Pretražite obrazac po nazivu (npr. ugovor o radu, PPI-4, prebivalište, saglasnost...)"
              className="w-full text-sm pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-slate-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
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
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sve kategorije</span>
              </button>
              <div className="text-xs text-slate-500">
                Ukupno obrazaca: <strong>{aktivnaKategorijaObj.items.length}</strong>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Folder className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{aktivnaKategorijaObj.name}</h2>
                  <p className="text-xs text-slate-500">Izaberite popunjavanje ili preuzimanje praznog obrasca</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {aktivnaKategorijaObj.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 px-3 rounded-xl transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">{item.title}</div>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                          <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-semibold">
                            {item.file.split('.').pop()?.toUpperCase()}
                          </span>
                          <span>Izvor: {item.source}</span>
                        </div>
                      </div>
                    </div>

                    {/* Dve opcije za svaki obrazac: Popuni ili Preuzmi prazan */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                      <Link
                        href={`/obrasci/popuni?naziv=${encodeURIComponent(item.title)}&kategorija=${encodeURIComponent(aktivnaKategorijaObj.name)}&fajl=${encodeURIComponent(item.file)}&izvor=${item.source}`}
                        className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition-colors shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Popuni online</span>
                      </Link>

                      <a
                        href={`/api/obrasci/preuzmi?izvor=${item.source}&kategorija=${encodeURIComponent(aktivnaKategorijaObj.name)}&fajl=${encodeURIComponent(item.file)}`}
                        className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-lg transition-colors border border-slate-200"
                        title="Preuzmite prazan originalni obrazac"
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
                  className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Folder className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {kat.name}
                        </h3>
                        <span className="text-xs text-slate-500">{kat.count} obrazaca</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
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
