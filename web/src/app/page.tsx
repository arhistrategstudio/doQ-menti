import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Search, FileText, Zap, ChevronRight, Code } from "lucide-react";
import { HomeAiAsistent } from "@/components/home/HomeAiAsistent";
import katalog from "@/data/katalog-obrazaca.json";

function slugKategorije(name: string) {
  return `/obrasci?kategorija=${encodeURIComponent(name)}`;
}

const ukupnoObrazaca = (katalog as { count: number }[]).reduce(
  (s, k) => s + k.count,
  0
);

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0E1015] text-slate-300 selection:bg-indigo-500/30 selection:text-indigo-200 font-sans flex flex-col relative overflow-hidden">
      
      {/* ─── BACKGROUND IMAGE & GRID & GLOWS ─────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center z-0">
        {/* Background Image */}
        <div
          className="absolute inset-0 opacity-[0.15] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/bg-documents.jpg')" }}
        ></div>
        {/* Subtle Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`, 
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)'
          }}
        ></div>
        {/* Top Glow */}
        <div className="absolute -top-32 w-[600px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute top-20 w-[400px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full mix-blend-screen"></div>
      </div>

      {/* ─── HEADER (Glassmorphic) ────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.05] bg-[#0E1015]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-white group">
            <img src="/logo.jpg" alt="doQ-menti" className="w-9 h-9 rounded-lg shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all" />
            <span>doQ-menti</span>
          </Link>

          <nav className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/obrasci"
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Katalog
              <span className="px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                {ukupnoObrazaca}
              </span>
            </Link>
            <Link
              href="/ugovori/kupoprodaja-vozila"
              className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg bg-white text-black hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              <Zap className="w-4 h-4 text-indigo-600" />
              <span>Start</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* ─── HERO SECTION ─────────────────────────────────────────────── */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-start pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300 mb-8 backdrop-blur-sm shadow-sm cursor-default hover:bg-indigo-500/20 transition-colors">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Generisanje pravnih dokumenata v2.0
        </div>

        {/* Headlines */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-center tracking-tight text-white max-w-4xl leading-[1.1]">
          Kreirajte pravne dokumente <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            brzinom koda.
          </span>
        </h1>
        
        <p className="mt-6 text-base sm:text-lg text-center text-slate-400 max-w-2xl leading-relaxed">
          Zaboravite papire i Word šablone. Generišite, popunite i preuzmite savršeno formatirane zvanične obrasce kroz moćan AI auto-fill interfejs.
        </p>

        {/* Global Search Bar (SaaS Style) */}
        <form action="/obrasci" method="GET" className="mt-10 w-full max-w-2xl relative group z-20">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur-sm opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative flex items-center bg-[#15171E] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <Search className="w-5 h-5 ml-4 text-slate-500" />
            <input
              type="text"
              name="q"
              placeholder="Pretraži preko 2.000 ugovora i obrazaca..."
              className="w-full bg-transparent text-sm text-white px-4 py-4 focus:outline-hidden placeholder-slate-500 font-medium"
            />
            <div className="pr-2 flex gap-2">
              <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 rounded-md">
                ⌘ K
              </kbd>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-indigo-500/25"
              >
                Traži
              </button>
            </div>
          </div>
        </form>

        {/* AI Asistent */}
        <div className="mt-16 w-full max-w-4xl relative z-20">
          <HomeAiAsistent />
        </div>

      </main>

      {/* ─── KATEGORIJE ──────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-white/5 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-white flex items-center gap-2">
              <Code className="w-6 h-6 text-indigo-400" />
              API Katalog Obrazaca
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Svi dokumenti su mapirani i spremni za instant auto-fill ili direktno preuzimanje.
            </p>
          </div>
          <Link
            href="/obrasci"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Prikaži sve rute <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {katalog.map((kat, idx) => (
            <Link
              key={idx}
              href={slugKategorije(kat.name)}
              className="group flex flex-col bg-[#13151A] border border-white/5 rounded-2xl p-5 hover:border-indigo-500/50 hover:bg-[#1A1D24] transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-md bg-white/5 text-slate-400 group-hover:text-indigo-300 group-hover:bg-indigo-500/20 border border-white/5 transition-colors">
                  {kat.count} docs
                </div>
              </div>
              <h3 className="font-semibold text-slate-200 leading-snug mb-1 group-hover:text-white transition-colors text-sm">
                {kat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
