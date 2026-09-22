'use client';

import React, { useState } from 'react';
import { QrCode, CreditCard, MessageSquare, ShieldCheck, CheckCircle2, Loader2, X, Download } from 'lucide-react';

interface Props {
  dokumentNaziv: string;
  iznosRsd: number;
  onZavrseno: () => void;
  onZatvori: () => void;
}

export function PlacanjeModal({ dokumentNaziv, iznosRsd, onZavrseno, onZatvori }: Props) {
  const [metod, setMetod] = useState<'ips_qr' | 'kartica' | 'sms'>('ips_qr');
  const [uToky, setUToku] = useState(false);
  const [placeno, setPlaceno] = useState(false);
  const [detalji, setDetalji] = useState<any>(null);

  const pokreniPlacanje = async (izabraniMetod: 'ips_qr' | 'kartica' | 'sms') => {
    setMetod(izabraniMetod);
    setUToku(true);
    try {
      const res = await fetch('/api/placanje/inicijalizuj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metod: izabraniMetod,
          dokument: dokumentNaziv,
          iznosRsd: iznosRsd,
        }),
      });
      const data = await res.json();
      setDetalji(data);
    } catch (e) {
      console.error(e);
    } finally {
      setUToku(false);
    }
  };

  const simulirajUspesnuUplatu = () => {
    setPlaceno(true);
    setTimeout(() => {
      onZavrseno();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header modala */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-blue-400 font-semibold tracking-wider uppercase">Sigurno plaćanje</div>
            <h3 className="font-bold text-base mt-0.5">{dokumentNaziv}</h3>
          </div>
          <button 
            onClick={onZatvori}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Iznos */}
        <div className="bg-blue-50 border-b border-blue-100 p-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-blue-900">Ukupan iznos za uplatu:</span>
          <span className="text-xl font-black text-blue-900">{iznosRsd} RSD</span>
        </div>

        {placeno ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-slate-900">Uplata uspešno primljena!</h4>
            <p className="text-xs text-slate-600">Vaš dokument se generiše i preuzimanje počinje...</p>
          </div>
        ) : (
          <div className="p-5 space-y-5">
            
            {/* 3 NAČINA PLAĆANJA */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Izaberite način plaćanja:
              </label>

              {/* 1. IPS QR Kod */}
              <button
                type="button"
                onClick={() => pokreniPlacanje('ips_qr')}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                  metod === 'ips_qr'
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-xs">
                    1
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-blue-600" />
                      IPS NBS Instant Plaćanje (m-banking)
                    </div>
                    <div className="text-[11px] text-slate-500">Banca Intesa, OTP, Raiffeisen, Poštanska...</div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Preporučeno
                </span>
              </button>

              {/* 2. Platne kartice */}
              <button
                type="button"
                onClick={() => pokreniPlacanje('kartica')}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                  metod === 'kartica'
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 font-bold text-xs">
                    2
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-indigo-600" />
                      Platne kartice (DinaCard, Visa, Master)
                    </div>
                    <div className="text-[11px] text-slate-500">Bezbedan domaći e-commerce gateway</div>
                  </div>
                </div>
              </button>

              {/* 3. SMS Plaćanje */}
              <button
                type="button"
                onClick={() => pokreniPlacanje('sms')}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                  metod === 'sms'
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold text-xs">
                    3
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-amber-600" />
                      SMS Plaćanje (Pošta Srbije / Agregator)
                    </div>
                    <div className="text-[11px] text-slate-500">Uplata zaduženjem na račun mobilnog</div>
                  </div>
                </div>
              </button>
            </div>

            {/* Prikaz izabranog metoda */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              {metod === 'ips_qr' && (
                <div className="text-center space-y-3">
                  <div className="w-36 h-36 mx-auto bg-white p-2 border-2 border-slate-300 rounded-xl shadow-xs flex flex-col items-center justify-center relative">
                    {/* Mock NBS IPS QR */}
                    <div className="text-[10px] font-black text-blue-900 border-b border-blue-900 pb-1 mb-1 w-full">NBS IPS QR</div>
                    <QrCode className="w-24 h-24 text-slate-900" />
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Otvorite mobilnu aplikaciju svoje banke, izaberite <strong>„IPS Pokaži / Skeniraj”</strong> i usmerite kameru ka ekranu.
                  </p>
                </div>
              )}

              {metod === 'kartica' && (
                <div className="space-y-2 text-center py-2">
                  <CreditCard className="w-10 h-10 text-indigo-600 mx-auto" />
                  <p className="text-slate-700 font-semibold">Preusmeravanje na zaštićeni centar za autorizaciju kartica...</p>
                  <p className="text-slate-500 text-[11px]">Prihvatamo DinaCard, Visa i Mastercard platne kartice.</p>
                </div>
              )}

              {metod === 'sms' && (
                <div className="space-y-2 text-center py-2">
                  <div className="font-mono text-sm bg-amber-100 text-amber-900 font-bold py-2 rounded-lg">
                    Pošaljite: <strong>DOK {detalji?.porudzbinaId ? detalji.porudzbinaId.slice(-6) : '123456'}</strong> na <strong>1399</strong>
                  </div>
                  <p className="text-slate-500 text-[11px]">Uplata se evidentira odmah po prispeću povratne poruke.</p>
                </div>
              )}
            </div>

            {/* Akciono dugme za potvrdu/simulaciju */}
            <button
              onClick={simulirajUspesnuUplatu}
              disabled={uToky}
              className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Potvrdi uplatu & Preuzmi PDF</span>
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
