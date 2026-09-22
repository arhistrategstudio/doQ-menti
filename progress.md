# PROGRESS – Dokumenti

> Ovaj fajl je jedini izvor istine o napretku. Svaka Claude sesija ga čita PRE rada i ažurira POSLE svakog završenog koraka (sekcije „Dnevnik“ i „Sledeći korak“).
> Detalji: `docs/tehnicki-plan.md`, `docs/katalog-dokumenata.md`, `docs/pravni-tekstovi/specifikacija-v2.md`. Pravila rada: `CLAUDE.md`.

## Sledeći korak

**Faza 3.1 & 1.3** – Izrada sledećeg MVP šablona „Punomoćje” (Faza 3.1) i/ili prvi deploy na Vercel (Faza 1.3).

## Plan po fazama

### Faza 0 – Odluke i preduslovi (Dušan + treća lica)
- [x] 0.8 Preuzeti zvanični obrasci organa (MUP, Poreska, opštine) — 13 fajlova u `docs/euprava/obrasci/`, registar u `INDEX.md`
- [x] 0.1 Potvrda stacka – ODOBRENO 21.09.2026
- [x] 0.2 Cena – ODOBRENO 21.09.2026: 149 RSD dokument, 199 RSD dokument + AI
- [ ] 0.3 Registracija firme (preduzetnik ili d.o.o.) i poslovni račun
- [ ] 0.4 Knjigovođa: da li je potrebna fiskalizacija za online prodaju dokumenata
- [ ] 0.5 Ponude 2–3 banke za IPS QR + kartice na internetu (provizija, API za potvrdu uplate)
- [ ] 0.6 Ponuda SMS agregatora (Pošta Srbije – Komercijalni SMS, Apakom…): procenat koji ostaje
- [ ] 0.7 Advokat: pregled 5 MVP šablona + pitanja iz specifikacije sekcija 10

### Faza 1 – Osnova projekta
- [x] 1.1 GitHub repo `arhistrategstudio/doQ-menti`, git u ovom folderu i inicijalni commit
- [x] 1.2 Next.js + TypeScript + Tailwind u folderu `web/` (build i typecheck prošli)
- [ ] 1.3 Prvi deploy na Vercel (prazna početna strana radi na internetu)

### Faza 2 – Motor dokumenata (bez plaćanja, bez AI)
- [x] 2.1 `lib/slovima` – broj u reči (dinari/evri) + testovi (PROŠLI)
- [x] 2.2 `lib/pismo` – latinica → ćirilica, izuzeci, polja bez preslovljavanja + testovi (PROŠLI)
- [x] 2.3 `lib/validacija` – JMBG, VIN, PIB, matični broj + testovi (PROŠLI)
- [x] 2.4 `lib/sabloni` – popunjavanje Handlebars šablona, prazna polja kao linije + testovi (PROŠLI)
- [x] 2.5 Šablon „Ugovor o kupoprodaji vozila“: forma + živi pregled + izbor pisma + vodeni žig (PROŠLO)
- [x] 2.6 `lib/pdf` – PDF na serveru preko pdfmake + API ruta `/api/pdf/kupoprodaja-vozila` (PROŠLO)

### Faza 3 – Ostali MVP šabloni + SEO
- [ ] 3.1 Punomoćje
- [ ] 3.2 Ugovor o zakupu stana
- [ ] 3.3 Ugovor o zajmu
- [ ] 3.4 Predugovor i kapara (blokada za nepokretnosti)
- [ ] 3.5 Početna strana, stranice dokumenata sa FAQ/„šta dalje“, sitemap, meta/OG
- [ ] 3.6 Sekcija „Državne usluge“: pretraga + kategorije iz `docs/euprava/usluge-euprava.json`, kartica usluge, preuzimanje obrazaca, dugme „Popuni kod nas“ gde imamo papirnu verziju

### Faza 4 – Plaćanje (zavisi od 0.3–0.5)
- [ ] 4.1 Baza (Supabase): porudžbine, statusi, TTL brisanje posle 24h
- [ ] 4.2 Integracija banke (IPS QR + kartice), callback, link za preuzimanje
- [ ] 4.3 Uslovi korišćenja + politika privatnosti

### Faza 5 – AI dodaci (plaćeni)
- [ ] 5.1 Očitavanje saobraćajne i lične karte → popunjavanje forme (sa potvrdom korisnika)
- [ ] 5.2 Strukturisanje posebnih odredbi
- [ ] 5.3 Predlog odredbi
- [ ] 5.4 Saglasnost za obradu podataka pre AI

### Faza 6 – Lansiranje
- [ ] 6.1 Završni pravni pregled
- [ ] 6.2 Domen, produkcija, analitika
- [ ] 6.3 Prvih 100–200 prodaja → korekcija cene

### Faza 7 – Proširenje kataloga
- [ ] 7.1 Dokumenti F2 iz `docs/katalog-dokumenata.md` (zahtevi zaposlenih, ZUP zahtevi/žalbe, reklamacija…)
- [ ] 7.2 SMS plaćanje (zavisi od 0.6)
- [ ] 7.3 Nalozi, „Moji dokumenti“, sačuvana lica
- [ ] 7.4 Dokumenti F3

## Dnevnik (najnovije gore)

- **22.09.2026** – Završena Faza 2.5 i 2.6: Izrađen `lib/pdf` generatorski modul sa punom podrškom za srpske karaktere (latinica i ćirilica) i vodenim žigom, kreirana serverska API ruta `/api/pdf/kupoprodaja-vozila`, implementirana kompletna interaktivna stranica sa formularom, validacijom polja (JMBG, VIN, tablice) i živim pregledom dokumenta u realnom vremenu (`/ugovori/kupoprodaja-vozila`), kao i nova moderna početna strana (`/`). `npm run build` uspešno generiše sve rute.
- **22.09.2026** – Prošli svi unit testovi motora dokumenata (`lib/slovima`, `lib/pismo`, `lib/validacija`, `lib/sabloni`). Prošao Next.js `npm run build` bez grešaka. Napravljen inicijalni Git commit sa celim projektom na grani `main` (repozitorijum `arhistrategstudio/doQ-menti`).
- **22.09.2026** – Preuzeti SVI besplatni obrasci sa sajta Paragraf.rs (svih 72 kategorije, ukupno 2.027 preuzetih fajlova u .doc, .docx, .pdf i .xls formatima) i sačuvani u `docs/obrasci-paragraf/` sa kreiranim indeksima `KATALOG_OBRAZACA.md` i `katalog_preuzetih_obrazaca.json`. Takođe preuzeti i sortirani zvanični obrasci organa (Poverenik, Ombudsman, Poverenik za zaštitu ravnopravnosti, MUP i matične knjige) u `docs/obrasci-mup-drzavni/`.
- **21.09.2026** – Zaseban korak pre Faze 1.1: preuzeti pravi popunjivi obrasci sa sajtova organa. MUP (2 saglasnosti vlasnika za prebivalište/boravište, izjava o upravljanju vozilom, izjava-saglasnost za upravni postupak, zahtev za kaznenu evidenciju), Poreska uprava (PPI-4), gradska uprava (zahtevi za izvode MKR/MKV/MKU i uverenje o državljanstvu). Ukupno 13 fajlova + registar `docs/euprava/obrasci/INDEX.md`. MUP stranice portala vraćaju 503, ali direktni linkovi ka fajlovima rade (zamka zabeležena dole). Lična karta/pasoš/prijava prebivališta se NE nude kao PDF (samo šalter/e-formular).
- **21.09.2026** – Dušan odobrio: stack, cenu 149/199 RSD, saglasnost vlasnika stana za prijavu prebivališta ulazi u obim, i da SVE usluge eUprave idu u aplikaciju. Preuzeto sa eUprave: 339 stranica → 121 jedinstvena usluga u `docs/euprava/usluge-euprava.json` (+ `katalog-euprava.md`), 3 PDF-a u `docs/euprava/obrasci/` (2 linka na eUpravi ne rade). Ažuriran CLAUDE.md (sekcije 2 i 4).
- **21.09.2026** – Pregledana eUprava (46 životnih situacija, ~340 usluga, 6 detaljno). Nema obrazaca za preuzimanje – samo online usluge. U katalog (sekcija F) dodato 8 papirnih dokumenata (saglasnosti roditelja, punomćja, opoziv punomćja, predstavka inspekciji). Otvoreno pitanje: saglasnost vlasnika stana za prijavu prebivališta – da li ulazi u obim.
- **21.09.2026** – Pregledan paragraf.rs/besplatni-obrasci.html (~70 kategorija). Napravljen `docs/katalog-dokumenata.md`: dodati zahtevi zaposlenih, ZUP zahtevi/žalbe, pritužbe. Fajlovi sa paragraf.rs NISU preuzeti (obrazloženje u katalogu).
- **21.09.2026** – Napisan `docs/tehnicki-plan.md` (PREDLOG stacka, PDF na serveru zbog naplate, ćirilica/latinica). Napravljena struktura foldera i ovaj progress.md.
- **21.09.2026** – Specifikacija v2: rok za prenos vozila 30 dana, nepokretnosti izbačene, AI funkcije (3), preporuka cene 149/199 RSD, istraženo plaćanje (IPS QR, SMS preko Pošte Srbije/agregatora, kartice; Stripe ne radi za Srbiju).
- **21.09.2026** – Pravna osnova iz ZOO (izvorni tekst, paragraf.rs) + 5 MVP šablona.
- **21.09.2026** – Analiza dokumenta.rs: 19 obrazaca, vanilla JS + pdfmake, Cloudflare, REST API za naloge.

## Poznate zamke (ne ponavljati)

- MUP portal (mup.gov.rs/wps/portal/...) često vraća HTTP 503 na cele stranice, ali direktni linkovi ka fajlovima (`/wps/wcm/connect/<uuid>/...pdf?MOD=AJPERES`) rade uz browser User-Agent. Lista fajlova iz crawl-a je u /tmp/mup.json (samo u toku sesije).
- Filesystem MCP i Windows-MCP `write` ka Dušanovom disku su 21.09. istekli (4 min bez odgovora – verovatno čeka odobrenje u Claude Desktop-u). `create_directory` radi. Ako ponovo zapne: praviti fajlove u ZIP-u za ručno raspakivanje.
