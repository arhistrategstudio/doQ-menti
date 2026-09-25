'use client';

import React, { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import 'pdfjs-dist/legacy/web/pdf_viewer.css';

type PoljeObj = { id: string; type?: string; exportValues?: string };
type PdfDok = {
  annotationStorage: { getValue: (id: string, def: { value?: unknown }) => { value?: unknown } };
  getFieldObjects: () => Promise<Map<string, PoljeObj[]> | Record<string, PoljeObj[]> | null>;
};

export type PdfPopunjiviHandle = {
  // Vrednosti koje je korisnik upisao, po imenu polja u PDF-u.
  vrednosti: () => Promise<Record<string, string | boolean>>;
};

type Props = {
  url: string;
  onUcitano: (imaPolja: boolean) => void;
  onGreska: () => void;
};

// Prikazuje ORIGINALNI PDF sa poljima u koja korisnik upisuje direktno (pdf.js forme).
export const PdfPopunjiviPrikaz = forwardRef<PdfPopunjiviHandle, Props>(function PdfPopunjiviPrikaz(
  { url, onUcitano, onGreska },
  ref
) {
  const kontejnerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const dokRef = useRef<PdfDok | null>(null);
  const zadatakRef = useRef<{ destroy: () => Promise<void> } | null>(null);

  useImperativeHandle(ref, () => ({
    vrednosti: async () => {
      const dok = dokRef.current;
      const rezultat: Record<string, string | boolean> = {};
      if (!dok) return rezultat;
      const sirovo = await dok.getFieldObjects();
      if (!sirovo) return rezultat;
      const polja = sirovo instanceof Map ? Array.from(sirovo.entries()) : Object.entries(sirovo);
      for (const [ime, vidzeti] of polja) {
        for (const w of vidzeti) {
          const v = dok.annotationStorage.getValue(w.id, { value: undefined }).value;
          if (v === undefined) continue;
          if (w.type === 'radiobutton') {
            if (v === true && w.exportValues) rezultat[ime] = w.exportValues;
          } else if (typeof v === 'boolean') {
            rezultat[ime] = v;
          } else if (Array.isArray(v)) {
            if (v.length) rezultat[ime] = String(v[0]);
          } else {
            rezultat[ime] = String(v);
          }
        }
      }
      return rezultat;
    },
  }));

  useEffect(() => {
    let otkazano = false;
    (async () => {
      try {
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
        const viewerLib = await import('pdfjs-dist/legacy/web/pdf_viewer.mjs');
        pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.min.mjs', import.meta.url).toString();

        const eventBus = new viewerLib.EventBus();
        const linkService = new viewerLib.PDFLinkService({ eventBus });
        const viewer = new viewerLib.PDFViewer({
          container: kontejnerRef.current!,
          viewer: viewerRef.current!,
          eventBus,
          linkService,
          annotationMode: pdfjs.AnnotationMode.ENABLE_FORMS,
        });
        linkService.setViewer(viewer);
        eventBus.on('pagesinit', () => {
          viewer.currentScaleValue = 'page-width';
        });

        const zadatak = pdfjs.getDocument({ url });
        zadatakRef.current = zadatak;
        const dok = await zadatak.promise;
        if (otkazano) return;
        dokRef.current = dok as unknown as PdfDok;
        viewer.setDocument(dok);
        linkService.setDocument(dok);
        const polja = await dok.getFieldObjects();
        const imaPolja = !!polja && (polja instanceof Map ? polja.size > 0 : Object.keys(polja).length > 0);
        if (!otkazano) onUcitano(imaPolja);
      } catch (e) {
        console.error('Greška pri učitavanju PDF-a:', e);
        if (!otkazano) onGreska();
      }
    })();
    return () => {
      otkazano = true;
      zadatakRef.current?.destroy();
      zadatakRef.current = null;
      dokRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return (
    <div ref={kontejnerRef} className="absolute inset-0 overflow-auto bg-[#525659]">
      <div ref={viewerRef} className="pdfViewer" />
    </div>
  );
});
