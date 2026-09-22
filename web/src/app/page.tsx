import React from "react";
import Link from "next/link";
import { ShieldCheck, Sparkles, Clock, Zap, ArrowRight, Search, FileText, Home as HomeIcon, Briefcase, Plane, Coins } from "lucide-react";
import { HomeAiAsistent } from "@/components/home/HomeAiAsistent";
import { KategorijeCombobox } from "@/components/home/KategorijeCombobox";
import katalog from "@/data/katalog-obrazaca.json";

const ukupnoObrazaca = (katalog as { count: number }[]).reduce((s, k) => s + k.count, 0);
const brojKategorija = (katalog as { name: string }[]).length;

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col" style={{ color: "#1C1C1E" }}>
      {/* POZADINA */}
      <div className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/background-doc.jpg')" }} />
      <div className="fixed inset-0 -z-10" style={{ background: "linear-gradient(180deg, rgba(12,20,15,0.82) 0%, rgba(12,20,15,0.72) 45%, rgba(12,20,15,0.88) 100%)" }} />

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b backdrop-blur-md" style={{ backgroundColor: "rgba(26,58,42,0.55)", borderColor: "rgba(201,168,76,0.15)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-28 sm:h-36 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-extrabold text-4xl sm:text-5xl tracking-tight" style={{ color: "#F8F4EE" }}>
            <img src="/logo.png" alt="Logo" className="h-20 sm:h-28 w-auto object-contain" />
            <span>do<span style={{ color: "#C9A84C" }}>Q</span>-menti</span>
          </Link>
          <nav className="flex items-center gap-3 sm:gap-5">
            <Link href="/obrasci" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium transition-colors" style={{ color: "#C9A84C" }}>
              Svi obrasci
              <span className="text-xs font-normal opacity-70">({ukupnoObrazaca.toLocaleString("sr-RS")})</span>
            </Link>
            <Link href="/obrasci" className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-lg transition-all" style={{ backgroundColor: "#C9A84C", color: "#1A3A2A" }}>
              Popuni obrazac
              <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-32 pb-8 sm:pb-10 text-center">
          <div className="inline-flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full text-sm font-normal mb-6 float-slow" style={{ backgroundColor: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.35)" }}>
            <ShieldCheck className="w-3.5 h-3.5" />
            Usklađeno sa zakonima Republike Srbije
          </div>
          <h1 className="text-[2.25rem] sm:text-[3rem] lg:text-[3.75rem] font-semibold tracking-normal leading-[1.05]" style={{ color: "#F8F4EE" }}>
            Pravni dokumenti i obrasci
            <br />
            <span style={{ color: "#C9A84C" }}>za 2 minuta</span>
          </h1>
          <p className="mt-5 text-sm sm:text-base max-w-xl mx-auto leading-relaxed" style={{ color: "rgba(248,244,238,0.75)" }}>
            Popunite ugovor ili obrazac online uz pametni AI auto-fill i trenutno preuzimanje — ili skinite čist prazan fajl.
          </p>
        </div>
      </section>

      {/* DVA PANELA */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

          {/* LEVI PANEL: pretraga + kategorije */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: "#F8F4EE" }}>Pronađi dokument</h2>
            <p className="mt-1.5 text-sm" style={{ color: "rgba(248,244,238,0.72)" }}>{brojKategorija} kategorija · {ukupnoObrazaca.toLocaleString("sr-RS")} obrasca i ugovora</p>
            <div className="mt-3 h-px w-16" style={{ backgroundColor: "#C9A84C" }} />

            <form action="/obrasci" method="GET" className="mt-14 relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#8A9A8C" }} />
              <input type="text" name="q" placeholder="Pretražite obrasce (npr. ugovor o zakupu, punomoćje...)" className="w-full text-sm pl-12 pr-24 py-4 rounded-xl border focus:ring-2 focus:outline-none transition-all shadow-sm placeholder:text-[#AEBAAE] backdrop-blur-sm" style={{ backgroundColor: "rgba(20,46,33,0.55)", color: "#F8F4EE", borderColor: "rgba(201,168,76,0.30)", outlineColor: "#C9A84C" }} />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm" style={{ backgroundColor: "#C9A84C", color: "#1A3A2A" }}>Traži</button>
            </form>

            <div className="mt-5">
              <KategorijeCombobox kategorije={katalog as { name: string; count: number }[]} />
            </div>
          </div>

          {/* DESNI PANEL: popunjavanje podataka */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: "#F8F4EE" }}>Popunite svoje podatke</h2>
            <p className="mt-1.5 text-sm" style={{ color: "rgba(248,244,238,0.72)" }}>Unesite jednom — AI ubaci podatke u svaki dokument.</p>
            <div className="mt-3 h-px w-16" style={{ backgroundColor: "#C9A84C" }} />
            <div className="mt-6">
              <HomeAiAsistent />
            </div>
          </div>

        </div>

        {/* Prednosti */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <Clock className="w-4 h-4" />, title: "Brzo i bez čekanja", sub: "Spreman za štampu odmah" },
            { icon: <ShieldCheck className="w-4 h-4" />, title: "Pravna sigurnost", sub: "Po Zakonu o obligacijama" },
            { icon: <Sparkles className="w-4 h-4" />, title: "Pametni Auto-Fill", sub: "Unesite jednom, koristite svuda" },
            { icon: <Zap className="w-4 h-4" />, title: "3 načina plaćanja", sub: "IPS QR · Kartice · SMS" },
          ].map((item, i) => (
            <div key={item.title} className="flex flex-col items-start p-3 rounded-lg text-left float-slow" style={{ backgroundColor: "rgba(248,244,238,0.07)", border: "1px solid rgba(248,244,238,0.12)", animationDelay: `${i * 0.6}s` }}>
              <div style={{ color: "#C9A84C" }} className="mb-1.5">{item.icon}</div>
              <div className="font-bold text-xs" style={{ color: "#F8F4EE" }}>{item.title}</div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(248,244,238,0.55)" }}>{item.sub}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/obrasci" className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-lg border transition-all" style={{ backgroundColor: "#1A3A2A", color: "#F8F4EE", borderColor: "#1A3A2A" }}>
            Pretraži kompletan katalog obrazaca
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* NAJČEŠĆE KORIŠĆENI OBRASCI */}
      <section className="w-full">
        <div className="max-w-[1224px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-center text-[20px] leading-7 font-semibold tracking-normal" style={{ color: "rgba(248,244,238,0.55)" }}>
            Najčešće korišćeni obrasci
          </h2>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { icon: <FileText className="w-4 h-4" />, label: "Punomoćje", href: "/obrasci?q=punomo" },
              { icon: <HomeIcon className="w-4 h-4" />, label: "Ugovor o zakupu", href: "/obrasci?q=zakup" },
              { icon: <Briefcase className="w-4 h-4" />, label: "Ugovor o radu", href: "/obrasci?q=ugovor%20o%20radu" },
              { icon: <Plane className="w-4 h-4" />, label: "Putovanje deteta", href: "/obrasci?q=putovanje" },
              { icon: <Coins className="w-4 h-4" />, label: "Ugovor o pozajmici", href: "/obrasci?q=pozajmica" },
            ].map((o) => (
              <Link key={o.label} href={o.href} className="flex items-center gap-2 px-3 py-3 rounded-xl text-xs font-semibold transition-all hover:opacity-90 backdrop-blur-sm" style={{ backgroundColor: "rgba(20,46,33,0.45)", color: "#F8F4EE", border: "1px solid rgba(201,168,76,0.30)" }}>
                <span style={{ color: "#C9A84C" }} className="shrink-0">{o.icon}</span>
                <span className="truncate">{o.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-8 px-4 sm:px-6 backdrop-blur-md" style={{ backgroundColor: "rgba(26,58,42,0.55)", borderColor: "rgba(201,168,76,0.2)" }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: "rgba(248,244,238,0.55)" }}>
          <div>© {new Date().getFullYear()} <strong style={{ color: "#F8F4EE" }}>doQ-menti</strong>. Sva prava zadržana.</div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link href="/obrasci" className="hover:opacity-80 transition-opacity" style={{ color: "#C9A84C" }}>Katalog obrazaca</Link>
            <Link href="/pravno#uslovi" className="hover:opacity-80 transition-opacity" style={{ color: "#C9A84C" }}>Uslovi korišćenja</Link>
            <Link href="/pravno#privatnost" className="hover:opacity-80 transition-opacity" style={{ color: "#C9A84C" }}>Politika privatnosti</Link>
            <Link href="/pravno#placanje" className="hover:opacity-80 transition-opacity" style={{ color: "#C9A84C" }}>Plaćanje i reklamacije</Link>
            <Link href="/pravno#kolacici" className="hover:opacity-80 transition-opacity" style={{ color: "#C9A84C" }}>Kolačići</Link>
            <span>Pravno usklađeno sa zakonima RS</span>
            <span>IPS QR · Kartično · SMS plaćanje</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-4 text-[11px] leading-relaxed" style={{ color: "rgba(248,244,238,0.4)" }}>
          Pružalac usluge: [naziv privrednog subjekta] · MB [•] · PIB [•] · [sedište] · kontakt: [email]. Cene su iskazane u dinarima (RSD) sa uključenim PDV-om. Plaćanjem prihvatate Uslove korišćenja i Politiku privatnosti; reklamacije i pravo na odustanak opisani su u odeljku „Plaćanje i reklamacije".
        </div>
      </footer>
    </div>
  );
}
