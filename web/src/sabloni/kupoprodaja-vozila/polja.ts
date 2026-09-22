import { z } from 'zod';
import { validirajJMBG, validirajVIN, validirajRegistarskuOznaku } from '@/lib/validacija';

export const KupoprodajaVozilaSchema = z.object({
  // Opšti podaci
  mestoZakljucenja: z.string().min(2, 'Mesto je obavezno'),
  datumZakljucenja: z.string().min(1, 'Datum je obavezan'),

  // Prodavac
  prodavacImePrezime: z.string().min(3, 'Ime i prezime prodavca je obavezno'),
  prodavacMesto: z.string().min(2, 'Mesto prodavca je obavezno'),
  prodavacAdresa: z.string().min(3, 'Adresa prodavca je obavezna'),
  prodavacJmbg: z.string().refine(validirajJMBG, {
    message: 'Neispravan JMBG prodavca (mora imati 13 cifara i tačnu kontrolnu cifru)'
  }),
  prodavacBrojLk: z.string().min(4, 'Broj lične karte je obavezan'),
  prodavacMupLk: z.string().min(2, 'Nadležni organ izdavalac (PU/PS) je obavezan'),
  prodavacTekuciRacun: z.string().optional(),

  // Kupac
  kupacImePrezime: z.string().min(3, 'Ime i prezime kupca je obavezno'),
  kupacMesto: z.string().min(2, 'Mesto kupca je obavezno'),
  kupacAdresa: z.string().min(3, 'Adresa kupca je obavezna'),
  kupacJmbg: z.string().refine(validirajJMBG, {
    message: 'Neispravan JMBG kupca (mora imati 13 cifara i tačnu kontrolnu cifru)'
  }),
  kupacBrojLk: z.string().min(4, 'Broj lične karte je obavezan'),
  kupacMupLk: z.string().min(2, 'Nadležni organ izdavalac (PU/PS) je obavezan'),

  // Vozilo
  voziloMarka: z.string().min(2, 'Marka vozila je obavezna'),
  voziloModel: z.string().min(1, 'Model vozila je obavezan'),
  voziloBrojSasije: z.string().refine(validirajVIN, {
    message: 'Broj šasije (VIN) mora imati tačno 17 karaktera (bez I, O, Q)'
  }),
  voziloBrojMotora: z.string().min(3, 'Broj motora je obavezan'),
  voziloGodina: z.string().regex(/^\d{4}$/, 'Godina mora biti četvorocifren broj'),
  voziloKubikaza: z.string().min(1, 'Kubikaža motora je obavezna'),
  voziloSnagaKw: z.string().min(1, 'Snaga motora (kW) je obavezna'),
  voziloRegistracija: z.string().refine(validirajRegistarskuOznaku, {
    message: 'Neispravan format registarske oznake (npr. BG123AB)'
  }),
  voziloBoja: z.string().min(2, 'Boja vozila je obavezna'),

  // Cena i plaćanje
  cenaIznos: z.number().positive('Cena mora biti veća od 0'),
  cenaValuta: z.enum(['RSD', 'EUR']).default('RSD'),
  nacinPlacanja: z.enum(['gotovina', 'racun', 'pre_overe']).default('gotovina'),
  rokPlacanjaDana: z.string().optional(),
  troskoveSnosi: z.enum(['kupac', 'prodavac']).default('kupac'),

  // Posebne odredbe
  posebneOdredbe: z.string().optional(),
});

export type KupoprodajaVozilaData = z.infer<typeof KupoprodajaVozilaSchema>;

export interface PoljeDefinicija {
  name: keyof KupoprodajaVozilaData;
  label: string;
  placeholder?: string;
  tip: 'text' | 'number' | 'date' | 'select' | 'textarea';
  options?: { value: string; label: string }[];
  sekcija: string;
  bezPreslovljavanja?: boolean;
}

export const POLJA_KUPOPRODAJA_VOZILA: PoljeDefinicija[] = [
  // 1. Osnovni podaci
  { name: 'mestoZakljucenja', label: 'Mesto zaključenja ugovora', placeholder: 'Npr. Beograd', tip: 'text', sekcija: 'Osnovni podaci' },
  { name: 'datumZakljucenja', label: 'Datum zaključenja', tip: 'date', sekcija: 'Osnovni podaci' },

  // 2. Prodavac
  { name: 'prodavacImePrezime', label: 'Ime i prezime prodavca', placeholder: 'Petar Petrović', tip: 'text', sekcija: 'Prodavac' },
  { name: 'prodavacMesto', label: 'Mesto prebivališta', placeholder: 'Beograd', tip: 'text', sekcija: 'Prodavac' },
  { name: 'prodavacAdresa', label: 'Ulica i broj', placeholder: 'Knez Mihailova 10', tip: 'text', sekcija: 'Prodavac' },
  { name: 'prodavacJmbg', label: 'JMBG prodavca', placeholder: '13 cifara', tip: 'text', sekcija: 'Prodavac', bezPreslovljavanja: true },
  { name: 'prodavacBrojLk', label: 'Broj lične karte', placeholder: 'Npr. 012345678', tip: 'text', sekcija: 'Prodavac', bezPreslovljavanja: true },
  { name: 'prodavacMupLk', label: 'Izdata od strane PU/PS', placeholder: 'Npr. PU za grad Beograd', tip: 'text', sekcija: 'Prodavac' },
  { name: 'prodavacTekuciRacun', label: 'Broj tekućeg računa (opciono)', placeholder: '160-...', tip: 'text', sekcija: 'Prodavac', bezPreslovljavanja: true },

  // 3. Kupac
  { name: 'kupacImePrezime', label: 'Ime i prezime kupca', placeholder: 'Marko Marković', tip: 'text', sekcija: 'Kupac' },
  { name: 'kupacMesto', label: 'Mesto prebivališta', placeholder: 'Novi Sad', tip: 'text', sekcija: 'Kupac' },
  { name: 'kupacAdresa', label: 'Ulica i broj', placeholder: 'Bulevar oslobođenja 5', tip: 'text', sekcija: 'Kupac' },
  { name: 'kupacJmbg', label: 'JMBG kupca', placeholder: '13 cifara', tip: 'text', sekcija: 'Kupac', bezPreslovljavanja: true },
  { name: 'kupacBrojLk', label: 'Broj lične karte', placeholder: 'Npr. 098765432', tip: 'text', sekcija: 'Kupac', bezPreslovljavanja: true },
  { name: 'kupacMupLk', label: 'Izdata od strane PU/PS', placeholder: 'Npr. PU Novi Sad', tip: 'text', sekcija: 'Kupac' },

  // 4. Vozilo
  { name: 'voziloMarka', label: 'Marka vozila', placeholder: 'Npr. Volkswagen', tip: 'text', sekcija: 'Podaci o vozilu' },
  { name: 'voziloModel', label: 'Model vozila', placeholder: 'Npr. Golf 7', tip: 'text', sekcija: 'Podaci o vozilu' },
  { name: 'voziloBrojSasije', label: 'Broj šasije (VIN)', placeholder: '17 alfanumeričkih znakova', tip: 'text', sekcija: 'Podaci o vozilu', bezPreslovljavanja: true },
  { name: 'voziloBrojMotora', label: 'Broj motora', placeholder: 'Npr. CXX123456', tip: 'text', sekcija: 'Podaci o vozilu', bezPreslovljavanja: true },
  { name: 'voziloGodina', label: 'Godina proizvodnje', placeholder: 'Npr. 2017', tip: 'text', sekcija: 'Podaci o vozilu', bezPreslovljavanja: true },
  { name: 'voziloKubikaza', label: 'Radna zapremina motora (cm³)', placeholder: 'Npr. 1598', tip: 'text', sekcija: 'Podaci o vozilu', bezPreslovljavanja: true },
  { name: 'voziloSnagaKw', label: 'Snaga motora (kW)', placeholder: 'Npr. 81', tip: 'text', sekcija: 'Podaci o vozilu', bezPreslovljavanja: true },
  { name: 'voziloRegistracija', label: 'Registarska oznaka', placeholder: 'Npr. BG1234AB', tip: 'text', sekcija: 'Podaci o vozilu', bezPreslovljavanja: true },
  { name: 'voziloBoja', label: 'Boja vozila', placeholder: 'Npr. Siva metalik', tip: 'text', sekcija: 'Podaci o vozilu' },

  // 5. Cena i plaćanje
  { name: 'cenaIznos', label: 'Kupoprodajna cena', placeholder: 'Npr. 650000', tip: 'number', sekcija: 'Cena i plaćanje' },
  {
    name: 'cenaValuta',
    label: 'Valuta',
    tip: 'select',
    options: [
      { value: 'RSD', label: 'RSD (Dinar)' },
      { value: 'EUR', label: 'EUR (Evro)' },
    ],
    sekcija: 'Cena i plaćanje',
  },
  {
    name: 'nacinPlacanja',
    label: 'Način isplate',
    tip: 'select',
    options: [
      { value: 'gotovina', label: 'Gotovinski prilikom potpisivanja' },
      { value: 'racun', label: 'Uplatom na račun prodavca' },
      { value: 'pre_overe', label: 'Isplaćeno u celosti pre overe' },
    ],
    sekcija: 'Cena i plaćanje',
  },
  {
    name: 'troskoveSnosi',
    label: 'Troškove overe i poreza snosi',
    tip: 'select',
    options: [
      { value: 'kupac', label: 'Kupac (uobičajeno)' },
      { value: 'prodavac', label: 'Prodavac' },
    ],
    sekcija: 'Cena i plaćanje',
  },

  // 6. Posebne odredbe
  {
    name: 'posebneOdredbe',
    label: 'Posebne odredbe / primedbe (opciono)',
    placeholder: 'Npr. Uz vozilo se predaju 4 zimske gume na aluminijumskim felnama...',
    tip: 'textarea',
    sekcija: 'Posebne odredbe',
  },
];
