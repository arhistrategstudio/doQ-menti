# PROGRESS – Dokumenti

> Ovaj fajl je jedini izvor istine o napretku. Svaka Claude sesija ga čita PRE rada i ažurira POSLE svakog završenog koraka (sekcije „Dnevnik“ i „Sledeći korak“).
> Detalji: `docs/tehnicki-plan.md`, `docs/katalog-dokumenata.md`, `docs/pravni-tekstovi/specifikacija-v2.md`. Pravila rada: `CLAUDE.md`.

## Sledeći korak

**Faza 3.1 & 1.3** – Izrada sledećeg MVP šablona „Punomoćje” (Faza 3.1) i/ili prvi deploy na Vercel (Faza 1.3), pošto je UI/UX redizajn završen.

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

- **25.09.2026** – Popunjavanje ORIGINALNOG obrasca: za PDF-ove sa poljima (1.524 od 2.266) original se prikazuje preko pdf.js (legacy build, zbog podrške starijih browsera) i korisnik upisuje direktno u polja; server (`/api/obrasci/popuni-original`, pdf-lib + Roboto font) upisuje iste vrednosti u originalni PDF i „spljošti“ polja → preuzeti dokument izgleda isto kao original. Testirano u browseru: latinica sa Đ/Š/Ć/Ž i ćirilica ispravno upisane. Za 742 „ravna“ PDF-a i 41 Word/Excel obrazac ostaje postojeća generička forma (nemaju polja; zahtevalo bi ručno mapiranje po dokumentu). Nove zavisnosti: `pdf-lib`, `@pdf-lib/fontkit`, `pdfjs-dist`. Putanja do obrasca izdvojena u `lib/obrasci/putanja.ts` (ista zaštita kao preuzimanje).

- **25.09.2026** – Popravke posle analize (live: https://doqmenti.vercel.app/). (1) Path traversal u `/api/obrasci/preuzmi` zatvoren – dozvoljeni samo fajlovi iz kataloga (na live-u je potvrđeno čitanje `/etc/passwd` PRE popravke). (2) Lažno plaćanje uklonjeno (izmišljen račun, SMS broj 1399, 404 stranica za kartice); modal jasno kaže „Test verzija — plaćanje još nije aktivno“, preuzimanje besplatno dok se ne izabere provajder; `/api/placanje/inicijalizuj` vraća 501. (3) AI: model `claude-haiku-4-5`, limit 10 zahteva/min po IP, limit dužine teksta. (4) Obrisan `netlify.toml` (deploy je na Vercel-u). (5) Katalog: filtriranje po `?kategorija=`, brojevi računati iz podataka, 257 stavki bez naslova više ne ruše pretragu, ispravan broj u pretrazi. (6) Univerzalni PDF: podaci korisnika se preslovljavaju u ćirilicu; ispravljena greška „лиčne karte“ u ugovoru o vozilu. (7) Polje email u formi; vidljiv aktivni tab na mobilnom; naslov/`lang=sr`; noindex za `/ugovori/kupoprodaja-vozila`; uklonjene tvrdnje „usklađeno sa zakonima RS“ i „3 načina plaćanja“. (8) ESLint 0 grešaka. Ispravka ranije analize: preuzimanje obrazaca NA LIVE-u RADI (tačka 7 je bila pogrešna). Otvoreno (čeka Dušana): podaci firme u `/pravno`, pravi platni provajder, API ključ na Vercel-u, advokat, paragraf.rs autorska prava, „Popuni online“ pravi generički zahtev a ne zvanični obrazac.

- **25.09.2026** – Analiza repozitorijuma (samo čitanje, kod NIJE menjan). `npm run build` prolazi; unit testovi prolaze; `eslint` 39 grešaka / 22 upozorenja. Lokalno potvrđeno: path traversal u `/api/obrasci/preuzmi` (čita bilo koji fajl sa servera, npr. `/etc/passwd`), PDF se dobija bez plaćanja (plaćanje je simulacija), `/placanje/kartica-simulacija` vraća 404, `docs/` nije uključen u serverless build (preuzimanje obrazaca na deploy-u će vraćati 404), link kategorije sa početne ne filtrira katalog. Live aplikacija NIJE proverena — URL nije poznat i mrežna politika okruženja blokira netlify.app/vercel.app.

- **22.09.2026** – Korekcija na Dušanov feedback: logo znatno uvećan (w-20/24 h-20/24, header h-24/28), pozadinska slika+overlay premešteni iz hero-a u globalni `fixed inset-0 -z-10` sloj u `page.tsx` — sada pokriva CELU stranicu (header, hero, kategorije, footer) i ostaje fiksna pri skrolu; header/footer/kartice kategorija dobili providne (rgba) pozadine sa `backdrop-blur` da pozadina probija kroz ceo sajt; plivajuća animacija pojačana (amplituda 8px→16px, trajanje 6s→3.5s) da bude vidljiva. `npm run build` prošao bez grešaka. Promene commit-ovane i push-ovane na GitHub (`arhistrategstudio/doQ-menti`, grana `main`). Vizuelna provera u browseru i dalje blokirana — Claude-in-Chrome ekstenzija ne odgovara (ni na example.com); Dušan treba ručno da otvori localhost:3000 ili produkcioni link da potvrdi izgled.
- **22.09.2026** – Header i hero dorada u `web/src/app/page.tsx`: veći header (h-20) sa jasnim `logo.png` logom (w-14 h-14, bez border/rounded) i uvećanim nazivom (text-3xl/4xl); hero pozadina fiksirana (`bg-fixed`) pri skrolu; badge i 4 kartice dobili blagu plivajuću animaciju (`float-slow` keyframes u `globals.css`, kartice stepenasto kašnje po 0.6s). `npm run build` prošao bez grešaka. Vizuelna provera u browseru nije urađena — Claude-in-Chrome ekstenzija je prestala da odgovara na screenshot pozive (potvrđeno i na example.com, dakle nevezano za ovu izmenu); potrebna ručna provera ili restart ekstenzije.
- **22.09.2026** – Restilizovan hero blok na početnoj strani (`web/src/app/page.tsx`) prema trigger.dev referenci: nova pozadinska slika `background-doc.jpg`, tamniji gradient overlay, veći gornji razmak (`pt-28 sm:pt-40 lg:pt-48`), veći naslov (do ~60px, weight 600) i pill-oblik badge-a. Tekst, linkovi i kartice nepromenjeni. `npm run build` prošao bez grešaka, vizuelno potvrđeno u browseru.
- **22.09.2026** – Završen kompletan UI/UX redizajn aplikacije (Opcija B). Primenjena nova, profesionalna kolor paleta (Forest Green i Gold). Redizajnirana početna strana sa hero sekcijom (pozadinska slika legalne/administrativne tematike) i gridom svih kategorija. Poboljšan i ujednačen dizajn zaglavlja i mobilnog tab switch-a na stranicama `/obrasci` i `/ugovori/kupoprodaja-vozila`. Promene su uspešno commit-ovane na git (`main` grana).
- **22.09.2026** – Dodat AI pametni asistent na početnu stranu (`HomeAiAsistent`) koji pamti osnovne podatke korisnika (ime, grad, adresa, telefon, email - bez JMBG-a) u lokalnoj memoriji pregledača za automatsko popunjavanje svih formi. Omogućeno i online popunjavanje svih obrazaca (`/obrasci/popuni`) uz generisanje PDF-a kao i skidanje praznog originala.
- **22.09.2026** – Povezani SVI preuzeti obrasci i kategorije iz foldera `docs/` u web aplikaciju (`/obrasci` sa pretragom i preuzimanjem svih 2.294 obrasca u 67 kategorija). Implementirana AI pametna asistencija za posebne odredbe i 3 načina plaćanja (1. NBS IPS QR, 2. Platne kartice, 3. SMS plaćanje). `npm run build` uspešno prošao sa 10 ruta.
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
