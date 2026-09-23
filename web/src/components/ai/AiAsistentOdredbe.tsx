'use client';

import React, { useState } from 'react';
import { Sparkles, Wand2, Check } from 'lucide-react';

interface Props {
  trenutniUnos: string;
  onPrimeni: (tekst: string) => void;
  kontekst?: string;
  pismo?: 'latinica' | 'cirilica';
}

export function AiAsistentOdredbe({ trenutniUnos, onPrimeni, kontekst = '', pismo = 'latinica' }: Props) {
  const [ucitava, setUcitava] = useState(false);
  const [predlozi, setPredlozi] = useState<string[]>([]);
  const [prikaziPredloge, setPrikaziPredloge] = useState(false);
  const [greska, setGreska] = useState('');

  const zovi = async (body: Record<string, unknown>) => {
    setGreska('');
    const res = await fetch('/api/ai/asistencija', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, pismo }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.error || 'Greška AI servisa.');
    }
    return res.json();
  };

  const ucitajPredloge = async () => {
    setUcitava(true);
    setPrikaziPredloge(true);
    try {
      const d = await zovi({ tip: 'predlog_odredbi', kontekst });
      setPredlozi(d.predlozi || []);
    } catch (e) {
      setGreska(e instanceof Error ? e.message : 'Greška.');
    } finally {
      setUcitava(false);
    }
  };

  const strukturisiTekst = async () => {
    if (!trenutniUnos || trenutniUnos.trim() === '') return;
    setUcitava(true);
    try {
      const d = await zovi({ tip: 'strukturisi_odredbe', unos: trenutniUnos, kontekst });
      if (d.formatiranTekst) onPrimeni(d.formatiranTekst);
    } catch (e) {
      setGreska(e instanceof Error ? e.message : 'Greška.');
    } finally {
      setUcitava(false);
    }
  };

  const dugme = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-60';
  const dugmeStyle: React.CSSProperties = { backgroundColor: 'rgba(201,168,76,0.15)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.35)' };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={ucitajPredloge} disabled={ucitava} className={dugme} style={dugmeStyle}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>Predloži česte odredbe</span>
        </button>
        {trenutniUnos && trenutniUnos.trim().length > 5 && (
          <button type="button" onClick={strukturisiTekst} disabled={ucitava} className={dugme} style={dugmeStyle}>
            <Wand2 className="w-3.5 h-3.5" />
            <span>Pravno doteraj moj tekst</span>
          </button>
        )}
      </div>

      {greska && <div className="text-xs" style={{ color: '#E0A0A0' }}>{greska}</div>}

      {prikaziPredloge && (
        <div className="p-3 rounded-xl space-y-2 text-xs" style={{ backgroundColor: 'rgba(20,46,33,0.55)', border: '1px solid rgba(201,168,76,0.25)' }}>
          <div className="font-bold flex items-center justify-between" style={{ color: '#F8F4EE' }}>
            <span>Izaberite preporučenu odredbu:</span>
            <button type="button" onClick={() => setPrikaziPredloge(false)} style={{ color: 'rgba(248,244,238,0.6)' }}>Zatvori</button>
          </div>
          {ucitava ? (
            <div className="py-2" style={{ color: 'rgba(248,244,238,0.6)' }}>Učitavam predloge...</div>
          ) : (
            <div className="space-y-1.5">
              {predlozi.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onPrimeni(trenutniUnos ? `${trenutniUnos}\n${p}` : p);
                    setPrikaziPredloge(false);
                  }}
                  className="w-full text-left p-2 rounded-lg flex items-start gap-2 transition-colors"
                  style={{ backgroundColor: 'rgba(248,244,238,0.05)', border: '1px solid rgba(201,168,76,0.2)', color: 'rgba(248,244,238,0.9)' }}
                >
                  <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: '#C9A84C' }} />
                  <span>{p}</span>
                </button>
              ))}
            </div>
          )}
          <div className="pt-1 text-[11px]" style={{ color: 'rgba(248,244,238,0.45)' }}>Automatski predlog — nije pravni savet.</div>
        </div>
      )}
    </div>
  );
}
