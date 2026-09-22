"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronDown } from "lucide-react";

type Kategorija = { name: string; count: number };

export function KategorijeCombobox({ kategorije }: { kategorije: Kategorija[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const href = (name: string) => `/obrasci?kategorija=${encodeURIComponent(name)}`;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return kategorije;
    return kategorije.filter((k) => k.name.toLowerCase().includes(q));
  }, [query, kategorije]);

  const cipovi = useMemo(
    () => [...kategorije].sort((a, b) => b.count - a.count).slice(0, 8),
    [kategorije]
  );

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={wrapRef} className="relative w-full">
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#8A9A8C" }} />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Izaberi ili pretraži kategoriju…"
          className="w-full text-sm pl-12 pr-10 py-4 rounded-xl border focus:outline-none focus:ring-2 transition-all shadow-sm placeholder:text-[#AEBAAE] backdrop-blur-sm"
          style={{ backgroundColor: "rgba(20,46,33,0.55)", color: "#F8F4EE", borderColor: "rgba(201,168,76,0.30)", outlineColor: "#C9A84C" }}
        />
        <ChevronDown
          onClick={() => setOpen((v) => !v)}
          className="w-5 h-5 absolute right-3 top-1/2 cursor-pointer"
          style={{ color: "#8A9A8C", transform: open ? "translateY(-50%) rotate(180deg)" : "translateY(-50%)" }}
        />
      </div>

      {open && (
        <div className="absolute z-30 mt-2 w-full rounded-xl border shadow-lg overflow-auto" style={{ backgroundColor: "rgba(15,35,25,0.97)", borderColor: "rgba(201,168,76,0.25)", maxHeight: "300px" }}>
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-sm" style={{ color: "#8A9A8C" }}>Nema rezultata za „{query}"</div>
          ) : (
            filtered.map((kat) => (
              <Link key={kat.name} href={href(kat.name)} className="flex items-center justify-between gap-3 px-4 py-3 text-sm transition-colors hover:bg-[rgba(255,255,255,0.06)]" style={{ color: "#F8F4EE" }}>
                <span className="truncate font-medium">{kat.name}</span>
                <span className="text-xs shrink-0" style={{ color: "#8A9A8C" }}>{kat.count}</span>
              </Link>
            ))
          )}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        {cipovi.map((kat) => (
          <Link key={kat.name} href={href(kat.name)} className="w-full inline-flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90" style={{ backgroundColor: "rgba(201,168,76,0.16)", color: "#F8F4EE", border: "1px solid rgba(201,168,76,0.40)" }}>
            <span className="truncate">{kat.name}</span>
            <span className="shrink-0" style={{ color: "#C9A84C" }}>{kat.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
