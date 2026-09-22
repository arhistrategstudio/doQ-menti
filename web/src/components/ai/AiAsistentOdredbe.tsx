'use client';

import React, { useState } from 'react';
import { Sparkles, Wand2, Check, RefreshCw } from 'lucide-react';

interface Props {
  trenutniUnos: string;
  onPrimeni: (tekst: string) => void;
}

export function AiAsistentOdredbe({ trenutniUnos, onPrimeni }: Props) {
  const [ucitava, setUcitava] = useState(false);
  const [predlozi, setPredlozi] = useState<string[]>([]);
  const [prikaziPredloge, setPrikaziPredloge] = useState(false);

  const ucitajPredloge = async () => {
    setUcitava(true);
    setPrikaziPredloge(true);
    try {
      const res = await fetch('/api/ai/asistencija', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tip: 'predlog_odredbi_vozilo' }),
      });
      const data = await res.json();
      setPredlozi(data.predlozi || []);
    } catch (e) {
      console.error(e);
    } finally {
      setUcitava(false);
    }
  };

  const strukturisiTekst = async () => {
    if (!trenutniUnos || trenutniUnos.trim() === '') return;
    setUcitava(true);
    try {
      const res = await fetch('/api/ai/asistencija', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tip: 'strukturisi_odredbe',
          unos: trenutniUnos,
        }),
      });
      const data = await res.json();
      if (data.formatiranTekst) {
        onPrimeni(data.formatiranTekst);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUcitava(false);
    }
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={ucitajPredloge}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold transition-colors border border-indigo-200"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Predloži česte odredbe</span>
        </button>

        {trenutniUnos && trenutniUnos.trim().length > 5 && (
          <button
            type="button"
            onClick={strukturisiTekst}
            disabled={ucitava}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-semibold transition-colors border border-purple-200"
          >
            <Wand2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Pravno doteraj moj tekst</span>
          </button>
        )}
      </div>

      {prikaziPredloge && (
        <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2 text-xs">
          <div className="font-bold text-indigo-950 flex items-center justify-between">
            <span>Izaberite preporučenu odredbu:</span>
            <button 
              type="button" 
              onClick={() => setPrikaziPredloge(false)} 
              className="text-slate-400 hover:text-slate-600"
            >
              Zatvori
            </button>
          </div>

          {ucitava ? (
            <div className="text-slate-500 py-2">Učitavam predloge...</div>
          ) : (
            <div className="space-y-1.5">
              {predlozi.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    const noviTekst = trenutniUnos ? `${trenutniUnos}\n${p}` : p;
                    onPrimeni(noviTekst);
                    setPrikaziPredloge(false);
                  }}
                  className="w-full text-left p-2 rounded-lg bg-white border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors flex items-start gap-2 text-slate-700"
                >
                  <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
