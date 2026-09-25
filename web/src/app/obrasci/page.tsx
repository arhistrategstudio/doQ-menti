'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Folder, FileText, Download, Search, ChevronRight, 
  ArrowLeft, Building2, Shield, Layers, Edit3
} from 'lucide-react';
import katalog from '@/data/katalog-obrazaca.json';

type Kat = { name: string; count: number; items: { title: string; file: string; source: string }[] };

// Deo stavki (MUP, Poverenik) u katalogu nema naslov — koristi se naziv fajla bez ekstenzije.
const allCategories: Kat[] = (katalog as { name: string; count: number; items: { title?: string; file: string; source: string }[] }[]).map((k) => ({
  ...k,
  items: k.items.map((i) => ({ ...i, title: i.title || i.file.replace(/\.[^.]+$/, '') })),
}));

const UKUPNO = allCategories.reduce((s, k) => s + k.items.length, 0);

function ObrasciSadrzaj() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialKategorija = searchParams.get('kategorija');
  
  const [pretraga, setPretraga] = useState(initialQuery);
  const [izabranaKategorija, setIzabranaKategorija] = useState<string | null>(initialKategorija);


  const filtriraniPodaci = useMemo(() => {
    const q = pretraga.toLowerCase().trim();
    if (!q) return allCategories;
    return allCategories
      .map((kat: Kat) => {
        const odgovaraNazivKategorije = kat.name.toLowerCase().includes(q);
        const filtriraniObrasci = kat.items.filter((item: Kat['items'][number]) =>
          item.title.toLowerCase().includes(q) || item.file.toLowerCase().includes(q)
        );
        if (odgovaraNazivKategorije || filtriraniObrasci.length > 0) {
          return {
            ...kat,
            count: filtriraniObrasci.length > 0 ? filtriraniObrasci.length : kat.items.length,
            items: filtriraniObrasci.length > 0 ? filtriraniObrasci : kat.items,
          };
        }
        return null;
      })
      .filter((k): k is Kat => k !== null);
  }, [pretraga]);

  const aktivnaKategorijaObj = useMemo(() => {
    if (!izabranaKategorija) return null;
    return allCategories.find((k: Kat) => k.name === izabranaKategorija) || null;
  }, [izabranaKategorija]);

  return (
    <div className="relative min-h-screen pb-20" style={{ color: "#F8F4EE" }}>
      <div className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/background-doc.jpg')" }} />
      <div className="fixed inset-0 -z-10" style={{ background: "linear-gradient(180deg, rgba(10,18,13,0.90) 0%, rgba(10,18,13,0.86) 50%, rgba(10,18,13,0.94) 100%)" }} />
      {/* Header */}
      <header className="sticky top-0 z-30 border-b backdrop-blur-md" style={{ backgroundColor: "rgba(26,58,42,0.55)", borderColor: "rgba(201,168,76,0.2)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-extrabold text-xl tracking-tight flex items-center gap-2" style={{ color: "#F8F4EE" }}>
              <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
              <span>do<span style={{ color: "#C9A84C" }}>Q</span>-menti</span>
            </Link>
            <span style={{ color: "rgba(248,244,238,0.3)" }}>/</span>
            <span className="text-xs sm:text-sm font-medium truncate max-w-[180px] sm:max-w-md" style={{ color: "rgba(248,244,238,0.7)" }}>
              Katalog svih obrazaca ({UKUPNO.toLocaleString('sr-RS')})
            </span>
          </div>

          <Link
            href="/"
            className="text-xs font-semibold transition-colors hover:opacity-80"
            style={{ color: "#C9A84C" }}
          >
            ← Nazad na početnu
          </Link>
        </div>
      </header>

      {/* Hero i Pretraga */}
      <div className="py-10 px-4 sm:px-6 border-b" style={{ borderColor: "rgba(201,168,76,0.18)" }}>
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider"
            style={{ backgroundColor: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.35)" }}
          >
            <Layers className="w-3.5 h-3.5" />
            {allCategories.length} kategorija • {UKUPNO.toLocaleString('sr-RS')} obrazaca
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "#F8F4EE" }}>
            Katalog svih preuzetih i državnih obrazaca
          </h1>
          <p className="text-xs sm:text-sm max-w-2xl mx-auto" style={{ color: "rgba(248,244,238,0.75)" }}>
            Izaberite opciju: popunite obrazac online u aplikaciji sa automatskim ispisom ili preuzmite čist, prazan originalni fajl.
          </p>

          <div className="relative max-w-2xl mx-auto mt-6">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#8A9A8C" }} />
            <input
              type="text"
              value={pretraga}
              onChange={(e) => {
                setPretraga(e.target.value);
                setIzabranaKategorija(null);
              }}
              placeholder="Pretražite obrazac po nazivu (npr. ugovor o radu, PPI-4, prebivalište, saglasnost...)"
              className="w-full text-sm pl-12 pr-4 py-3.5 rounded-2xl border focus:ring-2 focus:outline-hidden transition-all placeholder:text-[#AEBAAE] backdrop-blur-sm"
              style={{ backgroundColor: "rgba(20,46,33,0.55)", borderColor: "rgba(201,168,76,0.30)", color: "#F8F4EE", outlineColor: "#C9A84C" }}
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
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9A84C] hover:opacity-80 bg-[rgba(201,168,76,0.15)] px-3 py-1.5 rounded-lg border border-[rgba(201,168,76,0.35)] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sve kategorije</span>
              </button>
              <div className="text-xs text-[rgba(248,244,238,0.6)]">
                Ukupno obrazaca: <strong>{aktivnaKategorijaObj.items.length}</strong>
              </div>
            </div>

            <div className="bg-[rgba(20,46,33,0.45)] backdrop-blur-sm rounded-2xl border border-[rgba(201,168,76,0.22)] p-6 shadow-xs">
              <div className="flex items-center gap-3 pb-4 border-b border-[rgba(201,168,76,0.14)] mb-6">
                <div className="w-10 h-10 rounded-xl bg-[rgba(201,168,76,0.15)] text-[#C9A84C] flex items-center justify-center">
                  <Folder className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#F8F4EE]">{aktivnaKategorijaObj.name}</h2>
                  <p className="text-xs text-[rgba(248,244,238,0.6)]">Izaberite popunjavanje ili preuzimanje praznog obrasca</p>
                </div>
              </div>

              <div className="divide-y divide-[rgba(248,244,238,0.10)]">
                {aktivnaKategorijaObj.items.map((item: Kat['items'][number], idx: number) => (
                  <div
                    key={idx}
                    className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[rgba(248,244,238,0.06)] px-3 rounded-xl transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-[#F8F4EE] leading-snug">{item.title}</div>
                        <div className="text-[11px] text-[rgba(248,244,238,0.6)] mt-1 flex items-center gap-2">
                          <span className="font-mono bg-[rgba(248,244,238,0.10)] px-1.5 py-0.5 rounded text-[rgba(248,244,238,0.75)] font-semibold">
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
                        className="inline-flex items-center gap-1.5 bg-[#C9A84C] hover:opacity-90 text-[#1A3A2A] font-semibold text-xs px-3.5 py-2 rounded-lg transition-colors shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Popuni online</span>
                      </Link>

                      <a
                        href={`/api/obrasci/preuzmi?izvor=${item.source}&kategorija=${encodeURIComponent(aktivnaKategorijaObj.name)}&fajl=${encodeURIComponent(item.file)}&download=1`}
                        className="inline-flex items-center gap-1.5 bg-[rgba(248,244,238,0.08)] hover:bg-[rgba(248,244,238,0.16)] text-[#F8F4EE] font-semibold text-xs px-3 py-2 rounded-lg transition-colors border border-[rgba(201,168,76,0.22)]"
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
              {filtriraniPodaci.map((kat: Kat) => (
                <div
                  key={kat.name}
                  onClick={() => setIzabranaKategorija(kat.name)}
                  className="bg-[rgba(20,46,33,0.45)] backdrop-blur-sm rounded-xl border border-[rgba(201,168,76,0.22)] p-5 shadow-xs hover:shadow-md hover:border-[#C9A84C] transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[rgba(201,168,76,0.15)] text-[#C9A84C] flex items-center justify-center group-hover:bg-[#C9A84C] group-hover:text-[#1A3A2A] transition-colors">
                        <Folder className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[#F8F4EE] line-clamp-1 group-hover:text-[#C9A84C] transition-colors">
                          {kat.name}
                        </h3>
                        <span className="text-xs text-[rgba(248,244,238,0.6)]">{kat.count} obrazaca</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[rgba(248,244,238,0.5)] group-hover:text-[#C9A84C] group-hover:translate-x-0.5 transition-all" />
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
