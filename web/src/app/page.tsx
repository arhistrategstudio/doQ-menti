import React from "react";
import Link from "next/link";
import { 
  FileText, ShieldCheck, Car, Key, Sparkles, 
  ArrowRight, Download, CheckCircle, Clock, Zap,
  Folder, Layers
} from "lucide-react";
import { HomeAiAsistent } from "@/components/home/HomeAiAsistent";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="font-extrabold text-2xl tracking-tight text-blue-600 flex items-center gap-1">
              <span>do<span className="text-indigo-600">Q</span>-menti</span>
            </Link>
            <span className="hidden sm:inline-block text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
              Srbija
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/obrasci"
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
            >
              <Folder className="w-4 h-4 text-blue-600" />
              <span>Svi obrasci (2.294)</span>
            </Link>
            <Link
              href="/ugovori/kupoprodaja-vozila"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-lg shadow-sm transition-all"
            >
              <span>Popuni ugovor</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50/70 via-indigo-50/30 to-slate-50 py-12 sm:py-16 px-4 sm:px-6 border-b border-slate-200/60">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-semibold mb-6">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            100% usklađeno sa zakonima Republike Srbije
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight">
            Pravno sigurni ugovori i obrasci za <span className="text-blue-600">2 minuta</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Popunite ugovor ili obrazac online uz pametni AI auto-fill, proveru JMBG/VIN broja i trenutno preuzimanje, ili preuzmite čist originalni fajl.
          </p>

          {/* AI ASISTENT NA POČETNOJ STRANI */}
          <div className="mt-8 text-left">
            <HomeAiAsistent />
          </div>

          {/* Brzi linkovi */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/ugovori/kupoprodaja-vozila"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all"
            >
              <Car className="w-5 h-5" />
              <span>Ugovor o kupoprodaji vozila (149 RSD)</span>
            </Link>
            <Link
              href="/obrasci"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm px-6 py-3.5 rounded-xl shadow-xs border border-slate-300 transition-all"
            >
              <Folder className="w-5 h-5 text-blue-600" />
              <span>Katalog svih obrazaca (2.294)</span>
            </Link>
          </div>

          {/* Prednosti */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <Clock className="w-5 h-5 text-blue-600 mb-2" />
              <div className="font-bold text-xs text-slate-900">Brzo i bez čekanja</div>
              <div className="text-xs text-slate-500 mt-0.5">Spreman za štampu odmah</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mb-2" />
              <div className="font-bold text-xs text-slate-900">Pravna sigurnost</div>
              <div className="text-xs text-slate-500 mt-0.5">Po Zakonu o obligacijama</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <Sparkles className="w-5 h-5 text-indigo-600 mb-2" />
              <div className="font-bold text-xs text-slate-900">Pametni Auto-Fill</div>
              <div className="text-xs text-slate-500 mt-0.5">Unesite jednom, koristite svuda</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <Zap className="w-5 h-5 text-amber-600 mb-2" />
              <div className="font-bold text-xs text-slate-900">3 načina plaćanja</div>
              <div className="text-xs text-slate-500 mt-0.5">IPS NBS QR, Kartice, SMS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Katalog dokumenata */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Istaknuti obrasci i ugovori</h2>
            <p className="text-sm text-slate-500 mt-1">Izaberite dokument za popunjavanje ili preuzimanje</p>
          </div>
          <Link
            href="/obrasci"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3.5 py-2 rounded-lg border border-blue-200 transition-colors self-start sm:self-auto"
          >
            <Layers className="w-4 h-4" />
            <span>Pogledaj svih 2.294 obrasca</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kartica 1: Kupoprodaja vozila */}
          <div className="bg-white rounded-2xl border-2 border-blue-500 p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between">
            <div className="absolute -top-3 right-5 bg-blue-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Najtraženije
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Ugovor o kupoprodaji vozila</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Zvanični ugovor za prenos vlasništva nad automobilom ili motociklom, sa rokom prenosa od 30 dana, ispisom cene slovima i AI asistencijom.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Format za notara i MUP</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xl font-black text-slate-900">149 RSD</span>
                <span className="text-xs text-slate-500 ml-1">/ PDF</span>
              </div>
              <Link
                href="/ugovori/kupoprodaja-vozila"
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors"
              >
                <span>Popuni</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Kartica 2: Specijalno punomoćje */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mb-4">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Specijalno punomoćje</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Ovlašćenje za upravljanje i registraciju motornog vozila ili zastupanje pred organima i ustanovama.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Online popunjavanje</span>
              <Link
                href="/obrasci/popuni?naziv=Specijalno+punomo%C4%87je&kategorija=Saobra%C4%87aj+i+putevi"
                className="inline-flex items-center gap-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors"
              >
                <span>Popuni</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Kartica 3: Ugovor o zakupu stana */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Ugovor o zakupu stana</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Ugovor o izdavanju nepokretnosti sa definisanim depozitom, otkaznim rokom i zapisnikom o primopredaji.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Online popunjavanje</span>
              <Link
                href="/obrasci/popuni?naziv=Ugovor+o+zakupu+stana&kategorija=Gra%C4%91evinarstvo%2C+komunalna%2C+stambena+delatnost+i+stambeni+odnosi"
                className="inline-flex items-center gap-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors"
              >
                <span>Popuni</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} <strong className="text-slate-800">doQ-menti</strong>. Sva prava zadržana.
          </div>
          <div className="flex gap-6">
            <Link href="/obrasci" className="hover:text-blue-600 transition-colors">Katalog svih obrazaca</Link>
            <span>Pravno usklađeno sa zakonima RS</span>
            <span>Bezbedno IPS / Kartično / SMS plaćanje</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
