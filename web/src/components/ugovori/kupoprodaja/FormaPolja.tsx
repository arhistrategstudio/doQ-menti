'use client';

import React from 'react';
import { FileText, User, UserCheck, Car, DollarSign, Sparkles } from 'lucide-react';
import { validirajJMBG, validirajVIN, validirajRegistarskuOznaku } from '@/lib/validacija';
import { AiAsistentOdredbe } from '@/components/ai/AiAsistentOdredbe';

interface Props {
  formData: Record<string, string | number>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onPosebneOdredbeChange?: (tekst: string) => void;
}

export function FormaPolja({ formData, onChange, onPosebneOdredbeChange }: Props) {
  const jmbgProdavacOk = !formData.prodavacJmbg || validirajJMBG(String(formData.prodavacJmbg));
  const jmbgKupacOk = !formData.kupacJmbg || validirajJMBG(String(formData.kupacJmbg));
  const vinOk = !formData.voziloBrojSasije || validirajVIN(String(formData.voziloBrojSasije));
  const regOk = !formData.voziloRegistracija || validirajRegistarskuOznaku(String(formData.voziloRegistracija));

  return (
    <div className="space-y-6">
      {/* 1. Osnovni podaci */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-base mb-4 pb-2 border-b border-slate-100">
          <FileText className="w-5 h-5 text-blue-600" />
          <span>1. Osnovni podaci</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mesto zaključenja</label>
            <input
              type="text"
              name="mestoZakljucenja"
              value={formData.mestoZakljucenja}
              onChange={onChange}
              placeholder="Npr. Beograd"
              className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Datum zaključenja</label>
            <input
              type="date"
              name="datumZakljucenja"
              value={formData.datumZakljucenja}
              onChange={onChange}
              className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* 2. Prodavac */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-base mb-4 pb-2 border-b border-slate-100">
          <User className="w-5 h-5 text-blue-600" />
          <span>2. Podaci o prodavcu</span>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Ime i prezime prodavca *</label>
            <input
              type="text"
              name="prodavacImePrezime"
              value={formData.prodavacImePrezime}
              onChange={onChange}
              placeholder="Petar Petrović"
              className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mesto prebivališta *</label>
              <input
                type="text"
                name="prodavacMesto"
                value={formData.prodavacMesto}
                onChange={onChange}
                placeholder="Beograd"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ulica i broj *</label>
              <input
                type="text"
                name="prodavacAdresa"
                value={formData.prodavacAdresa}
                onChange={onChange}
                placeholder="Knez Mihailova 10"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">JMBG (13 cifara) *</label>
              <input
                type="text"
                maxLength={13}
                inputMode="numeric"
                name="prodavacJmbg"
                value={formData.prodavacJmbg}
                onChange={onChange}
                placeholder="0101990710011"
                className={`w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:outline-hidden ${
                  jmbgProdavacOk ? 'border-slate-300 focus:ring-blue-500' : 'border-red-500 bg-red-50 text-red-900'
                }`}
              />
              {!jmbgProdavacOk && (
                <span className="text-xs text-red-600 mt-1 block">Neispravan JMBG</span>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Broj lične karte *</label>
              <input
                type="text"
                name="prodavacBrojLk"
                value={formData.prodavacBrojLk}
                onChange={onChange}
                placeholder="012345678"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Izdata od (PU/PS) *</label>
              <input
                type="text"
                name="prodavacMupLk"
                value={formData.prodavacMupLk}
                onChange={onChange}
                placeholder="PU Beograd"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          {formData.nacinPlacanja === 'racun' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Broj tekućeg računa prodavca *</label>
              <input
                type="text"
                name="prodavacTekuciRacun"
                value={formData.prodavacTekuciRacun}
                onChange={onChange}
                placeholder="Npr. 160-5100100200300-45"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          )}
        </div>
      </div>

      {/* 3. Kupac */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-base mb-4 pb-2 border-b border-slate-100">
          <UserCheck className="w-5 h-5 text-blue-600" />
          <span>3. Podaci o kupcu</span>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Ime i prezime kupca *</label>
            <input
              type="text"
              name="kupacImePrezime"
              value={formData.kupacImePrezime}
              onChange={onChange}
              placeholder="Marko Marković"
              className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mesto prebivališta *</label>
              <input
                type="text"
                name="kupacMesto"
                value={formData.kupacMesto}
                onChange={onChange}
                placeholder="Novi Sad"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ulica i broj *</label>
              <input
                type="text"
                name="kupacAdresa"
                value={formData.kupacAdresa}
                onChange={onChange}
                placeholder="Bulevar oslobođenja 5"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">JMBG (13 cifara) *</label>
              <input
                type="text"
                maxLength={13}
                inputMode="numeric"
                name="kupacJmbg"
                value={formData.kupacJmbg}
                onChange={onChange}
                placeholder="0202992800022"
                className={`w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:outline-hidden ${
                  jmbgKupacOk ? 'border-slate-300 focus:ring-blue-500' : 'border-red-500 bg-red-50 text-red-900'
                }`}
              />
              {!jmbgKupacOk && (
                <span className="text-xs text-red-600 mt-1 block">Neispravan JMBG</span>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Broj lične karte *</label>
              <input
                type="text"
                name="kupacBrojLk"
                value={formData.kupacBrojLk}
                onChange={onChange}
                placeholder="098765432"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Izdata od (PU/PS) *</label>
              <input
                type="text"
                name="kupacMupLk"
                value={formData.kupacMupLk}
                onChange={onChange}
                placeholder="PU Novi Sad"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Vozilo */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-base mb-4 pb-2 border-b border-slate-100">
          <Car className="w-5 h-5 text-blue-600" />
          <span>4. Podaci o vozilu</span>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Marka vozila *</label>
              <input
                type="text"
                name="voziloMarka"
                value={formData.voziloMarka}
                onChange={onChange}
                placeholder="Npr. Volkswagen"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Model vozila *</label>
              <input
                type="text"
                name="voziloModel"
                value={formData.voziloModel}
                onChange={onChange}
                placeholder="Npr. Golf 7"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Broj šasije (VIN) *</label>
              <input
                type="text"
                maxLength={17}
                name="voziloBrojSasije"
                value={formData.voziloBrojSasije}
                onChange={onChange}
                placeholder="WVWZZZAUZHP123456"
                className={`w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:outline-hidden uppercase font-mono ${
                  vinOk ? 'border-slate-300 focus:ring-blue-500' : 'border-red-500 bg-red-50 text-red-900'
                }`}
              />
              {!vinOk && (
                <span className="text-xs text-red-600 mt-1 block">VIN mora imati 17 karaktera</span>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Broj motora *</label>
              <input
                type="text"
                name="voziloBrojMotora"
                value={formData.voziloBrojMotora}
                onChange={onChange}
                placeholder="CXX123456"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Godina *</label>
              <input
                type="text"
                maxLength={4}
                inputMode="numeric"
                name="voziloGodina"
                value={formData.voziloGodina}
                onChange={onChange}
                placeholder="2018"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Zapremina (cm³) *</label>
              <input
                type="text"
                inputMode="numeric"
                name="voziloKubikaza"
                value={formData.voziloKubikaza}
                onChange={onChange}
                placeholder="1598"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Snaga (kW) *</label>
              <input
                type="text"
                inputMode="numeric"
                name="voziloSnagaKw"
                value={formData.voziloSnagaKw}
                onChange={onChange}
                placeholder="85"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Boja *</label>
              <input
                type="text"
                name="voziloBoja"
                value={formData.voziloBoja}
                onChange={onChange}
                placeholder="Siva metalik"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Registarska oznaka *</label>
            <input
              type="text"
              name="voziloRegistracija"
              value={formData.voziloRegistracija}
              onChange={onChange}
              placeholder="BG1234AB"
              className={`w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:outline-hidden uppercase font-mono ${
                regOk ? 'border-slate-300 focus:ring-blue-500' : 'border-red-500 bg-red-50 text-red-900'
              }`}
            />
          </div>
        </div>
      </div>

      {/* 5. Cena */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-base mb-4 pb-2 border-b border-slate-100">
          <DollarSign className="w-5 h-5 text-blue-600" />
          <span>5. Cena i uslovi plaćanja</span>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kupoprodajna cena *</label>
              <input
                type="number"
                inputMode="numeric"
                name="cenaIznos"
                value={formData.cenaIznos || ''}
                onChange={onChange}
                placeholder="650000"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Valuta</label>
              <select
                name="cenaValuta"
                value={formData.cenaValuta}
                onChange={onChange}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
              >
                <option value="RSD">RSD (Dinar)</option>
                <option value="EUR">EUR (Evro)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Način isplate</label>
              <select
                name="nacinPlacanja"
                value={formData.nacinPlacanja}
                onChange={onChange}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
              >
                <option value="gotovina">Gotovinski pri potpisivanju</option>
                <option value="racun">Uplatom na račun prodavca</option>
                <option value="pre_overe">Isplaćeno u celosti pre overe</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Troškove overe i poreza snosi</label>
              <select
                name="troskoveSnosi"
                value={formData.troskoveSnosi}
                onChange={onChange}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
              >
                <option value="kupac">Kupac (uobičajena praksa)</option>
                <option value="prodavac">Prodavac</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Posebne odredbe sa AI */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-base">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>6. Posebne odredbe (opciono)</span>
          </div>
          <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-bold">AI pametna asistencija</span>
        </div>
        <div>
          <textarea
            name="posebneOdredbe"
            rows={3}
            value={formData.posebneOdredbe}
            onChange={onChange}
            placeholder="Npr. Uz vozilo se predaje set zimskih točkova, servisna knjiga i dva originalna ključa..."
            className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />

          {/* AI Asistent za odredbe */}
          <AiAsistentOdredbe
            trenutniUnos={String(formData.posebneOdredbe ?? "")}
            onPrimeni={(noviTekst) => {
              if (onPosebneOdredbeChange) {
                onPosebneOdredbeChange(noviTekst);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
