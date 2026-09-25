'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, X, Info } from 'lucide-react';

interface Props {
  dokumentNaziv: string;
  iznosRsd: number;
  onZavrseno: () => void;
  onZatvori: () => void;
}

// Plaćanje još nije aktivno (provajder nije izabran). Do tada je preuzimanje besplatno i jasno označeno kao test.
export function PlacanjeModal({ dokumentNaziv, iznosRsd, onZavrseno, onZatvori }: Props) {
  const [preuzima, setPreuzima] = useState(false);

  const preuzmi = () => {
    setPreuzima(true);
    onZavrseno();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-blue-400 font-semibold tracking-wider uppercase">Preuzimanje</div>
            <h3 className="font-bold text-base mt-0.5">{dokumentNaziv}</h3>
          </div>
          <button onClick={onZatvori} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {preuzima ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
            <p className="text-xs text-slate-600">Vaš dokument se generiše i preuzimanje počinje...</p>
          </div>
        ) : (
          <div className="p-5 space-y-5">
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Test verzija — plaćanje još nije aktivno.</strong> Buduća cena: {iznosRsd} RSD. Do aktiviranja plaćanja preuzimanje je besplatno.
              </div>
            </div>
            <button
              onClick={preuzmi}
              className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Preuzmi PDF</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
