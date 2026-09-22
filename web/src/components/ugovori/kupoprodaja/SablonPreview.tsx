'use client';

import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Pismo } from '@/lib/pismo';

interface Props {
  previewHtml: string;
  pismo: Pismo;
  generisemPdf: boolean;
  onPreuzmiPdf: () => void;
}

export function SablonPreview({ previewHtml, pismo, generisemPdf, onPreuzmiPdf }: Props) {
  return (
    <div className="sticky top-20">
      <div className="flex items-center justify-between bg-slate-800 text-white px-4 py-3 rounded-t-xl">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <FileText className="w-4 h-4 text-blue-400" />
          <span>ŽIVI PREGLED UGOVORA</span>
        </div>
        <div className="text-xs text-slate-400">
          Pismo: <span className="text-white font-bold">{pismo === 'cirilica' ? 'Ćirilica' : 'Latinica'}</span>
        </div>
      </div>

      <div className="relative bg-white border border-t-0 border-slate-300 rounded-b-xl p-6 sm:p-8 shadow-md overflow-hidden max-h-[750px] overflow-y-auto">
        {/* Vodeni žig */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none opacity-5 rotate-[-30deg]">
          <span className="text-6xl font-black text-slate-950 tracking-widest uppercase">
            doQ-menti
          </span>
        </div>

        <div 
          className="prose prose-sm max-w-none text-slate-800"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      </div>

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-blue-900">
          <span className="font-bold">Cena generisanja:</span> 149 RSD
          <p className="text-blue-700">Preuzimate originalan PDF spreman za štampu i notara.</p>
        </div>
        <button
          onClick={onPreuzmiPdf}
          disabled={generisemPdf}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-sm transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{generisemPdf ? 'Generisanje...' : 'Preuzmi zvanični PDF'}</span>
        </button>
      </div>
    </div>
  );
}
