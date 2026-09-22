import React from "react";
import Link from "next/link";
import { ShieldCheck, Sparkles, Clock, Zap, ArrowRight, ChevronRight, Search } from "lucide-react";
import { HomeAiAsistent } from "@/components/home/HomeAiAsistent";
import katalog from "@/data/katalog-obrazaca.json";

// Svaka kategorija → link na /obrasci?kategorija=...
function slugKategorije(name: string) {
  return `/obrasci?kategorija=${encodeURIComponent(name)}`;
}

// Ukupan broj obrasca
const ukupnoObrazaca = (katalog as { count: number }[]).reduce(
  (s, k) => s + k.count,
  0
);

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F8F4EE", color: "#1C1C1E" }}>

      {/* ─── HEADER ─────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{ backgroundColor: "#1A3A2A", borderColor: "#14302200" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-extrabold text-2xl tracking-tight" style={{ color: "#F8F4EE" }}>
            <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full border border-gray-600" />
            <span>do<span style={{ color: "#C9A84C" }}>Q</span>-menti</span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-3 sm:gap-5">
            <Link
              href="/obrasci"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{ color: "#C9A84C" }}
            >
              Svi obrasci
              <span className="text-xs font-normal opacity-70">({ukupnoObrazaca.toLocaleString("sr-RS")})</span>
            </Link>
            <Link
              href="/ugovori/kupoprodaja-vozila"
              className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-lg transition-all"
              style={{ backgroundColor: "#C9A84C", color: "#1A3A2A" }}
            >
              Popuni ugovor
              <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* ─── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Pozadinska slika */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/bg-documents.jpg')" }}
        />
        {/* Tamni overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(26,58,42,0.93) 0%, rgba(26,58,42,0.80) 60%, rgba(20,40,30,0.70) 100%)" }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-semibold mb-6 uppercase tracking-wider"
            style={{ backgroundColor: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.35)" }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Usklađeno sa zakonima Republike Srbije
          </div>

          <h1
            className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight"
            style={{ color: "#F8F4EE" }}
          >
            Pravni dokumenti i obrasci
            <br />
            <span style={{ color: "#C9A84C" }}>za 2 minuta</span>
          </h1>

          <p className="mt-5 text-sm sm:text-base max-w-xl mx-auto leading-relaxed" style={{ color: "rgba(248,244,238,0.75)" }}>
            Popunite ugovor ili obrazac online uz pametni AI auto-fill i trenutno preuzimanje — ili skinite čist prazan fajl.
          </p>

          {/* Pretraga dokumenata na početnoj strani */}
          <form action="/obrasci" method="GET" className="mt-8 max-w-2xl mx-auto relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#8A9A8C" }} />
            <input
              type="text"
              name="q"
              placeholder="Pretražite 2.294 obrasca i dokumenta (npr. ugovor o zakupu, punomoćje...)"
              className="w-full text-sm pl-12 pr-24 py-4 rounded-xl border-none focus:ring-2 focus:outline-hidden transition-all shadow-lg"
              style={{ backgroundColor: "#F8F4EE", color: "#1C1C1E", outlineColor: "#C9A84C" }}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm"
              style={{ backgroundColor: "#C9A84C", color: "#1A3A2A" }}
            >
              Traži
            </button>
          </form>

          {/* AI Asistent */}
          <div className="mt-10 text-left max-w-2xl mx-auto">
            <HomeAiAsistent />
          </div>

          {/* Prednosti */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {[
              { icon: <Clock className="w-4 h-4" />, title: "Brzo i bez čekanja", sub: "Spreman za štampu odmah" },
              { icon: <ShieldCheck className="w-4 h-4" />, title: "Pravna sigurnost", sub: "Po Zakonu o obligacijama" },
              { icon: <Sparkles className="w-4 h-4" />, title: "Pametni Auto-Fill", sub: "Unesite jednom, koristite svuda" },
              { icon: <Zap className="w-4 h-4" />, title: "3 načina plaćanja", sub: "IPS QR · Kartice · SMS" },
            ].map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-start p-3 rounded-lg text-left"
                style={{ backgroundColor: "rgba(248,244,238,0.07)", border: "1px solid rgba(248,244,238,0.12)" }}
              >
                <div style={{ color: "#C9A84C" }} className="mb-1.5">{item.icon}</div>
                <div className="font-bold text-xs" style={{ color: "#F8F4EE" }}>{item.title}</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(248,244,238,0.55)" }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── KATEGORIJE ──────────────────────────────────────────────────── */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "#1A3A2A" }}>
            Kategorije dokumenata
          </h2>
          <p className="mt-2 text-sm" style={{ color: "#5C6B5E" }}>
            {(katalog as { name: string }[]).length} kategorija · {ukupnoObrazaca.toLocaleString("sr-RS")} obrasca i ugovora
          </p>
          <div className="mt-4 h-px w-16" style={{ backgroundColor: "#C9A84C" }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(katalog as { name: string; count: number }[]).map((kat) => (
            <Link
              key={kat.name}
              href={slugKategorije(kat.name)}
              className="group flex items-center justify-between gap-3 px-5 py-4 rounded-lg border transition-all duration-150"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "#E2D9CB",
                color: "#1C1C1E",
              }}
            >
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold leading-snug truncate group-hover:underline" style={{ color: "#1A3A2A" }}>
                  {kat.name}
                </span>
                <span className="text-xs mt-0.5" style={{ color: "#8A9A8C" }}>
                  {kat.count} {kat.count === 1 ? "obrazac" : kat.count < 5 ? "obrasca" : "obrazaca"}
                </span>
              </div>
              <ChevronRight
                className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                style={{ color: "#C9A84C" }}
              />
            </Link>
          ))}
        </div>

        {/* Link na kompletan katalog */}
        <div className="mt-10 text-center">
          <Link
            href="/obrasci"
            className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-lg border transition-all"
            style={{
              backgroundColor: "#1A3A2A",
              color: "#F8F4EE",
              borderColor: "#1A3A2A",
            }}
          >
            Pretraži kompletan katalog obrazaca
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────────── */}
      <footer
        className="border-t py-8 px-4 sm:px-6"
        style={{ backgroundColor: "#1A3A2A", borderColor: "rgba(201,168,76,0.2)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: "rgba(248,244,238,0.55)" }}>
          <div>
            © {new Date().getFullYear()}{" "}
            <strong style={{ color: "#F8F4EE" }}>doQ-menti</strong>. Sva prava zadržana.
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link href="/obrasci" className="hover:opacity-80 transition-opacity" style={{ color: "#C9A84C" }}>
              Katalog obrazaca
            </Link>
            <span>Pravno usklađeno sa zakonima RS</span>
            <span>IPS QR · Kartično · SMS plaćanje</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
