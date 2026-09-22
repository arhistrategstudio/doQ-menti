# Tehnički plan – Dokumenti

> Status: ODOBREN (Dušan, 21.09.2026) – stack iz sekcije 3 je odluka i upisan je u CLAUDE.md sekciju 2.

## 1. Kako aplikacija radi (tok)

1. Korisnik bira dokument → popunjava formu (podeljenu u sekcije).
2. Dok kuca, sa strane vidi živi pregled dokumenta sa vodenim žigom „UZORAK“ i biranjem pisma: latinica / ćirilica.
3. Klikne „Preuzmi PDF“ → bira paket (Dokument ili Dokument + AI) → plaća.
4. Posle potvrde uplate server generiše PDF i vraća link za preuzimanje (važi 24h).
5. Podaci iz forme brišu se sa servera najkasnije 24h posle preuzimanja.

## 2. Ključna arhitektonska odluka: PDF se pravi na SERVERU

dokumenta.rs pravi PDF u pregledaču jer je besplatan. Kod nas bi to značilo da svako može da zaobiđe plaćanje (PDF bi već bio u pregledaču). Zato:
- Pregled u pregledaču = HTML sa vodenim žigom (bez PDF-a).
- Pravi PDF nastaje samo na serveru, i to tek kad server dobije potvrdu uplate.
- Iskreno ograničenje: tekst u pregledu korisnik ipak može ručno da prepiše. To se ne može potpuno sprečiti; ublažava se vodenim žigom i time što plaćeni PDF ima čist, uredan format spreman za beležnika.

## 3. Predloženi stack

| Deo | Predlog | Zašto |
|---|---|---|
| Aplikacija (frontend + backend) | Next.js (App Router) + TypeScript | Jedan projekat za stranice i API; odlično radi sa Claude Code; dobar SEO (svaki dokument = svoja stranica, kao kod konkurenta) |
| Stil | Tailwind CSS | Brz rad, bez posebnih CSS fajlova |
| Šabloni dokumenata | Handlebars (`.hbs`) + definicija polja u TypeScript-u (Zod šema za validaciju) | Tekst ugovora ostaje čitljiv tekst koji advokat može da pregleda; uslovni blokovi `{{#if}}` zamenjuju `[[AKO]]` iz specifikacije |
| PDF | pdfmake (na serveru, Node) | Isto rešenje koristi konkurent – dokazano radi sa srpskim tekstom i ćirilicom; ne treba headless browser |
| Baza | PostgreSQL preko Supabase (region EU) | Samo porudžbine, statusi plaćanja i privremeni podaci forme (TTL 24h) |
| AI | Anthropic API (Claude), poziv samo sa servera | Vision za očitavanje saobraćajne/lične karte + strukturisanje odredbi; API ključ nikad u pregledaču |
| Hosting | Vercel (region Frankfurt) | Besplatan početni plan, automatski deploy iz GitHub-a |
| Plaćanje | Banka prihvatilac (IPS QR + kartice), zatim SMS agregator | Vidi specifikaciju sekcija 9; tačan provajder = Faza 0 |
| Repo | GitHub `arhistrategstudio/dokumenti` | Konvencija iz CLAUDE.md |

## 4. Ćirilica / latinica

- Izvorni tekst Ūajleona piše se u latinici. Ćirilica se dobija automatskom preslovljavanjem (transliteracijom) teksta posle popunjavanja.
- Latinica → ćirilica je skoro 1:1, osim dvoslova: lj→љ, nj→њ, dž→я. Problem su reči gde su to dva odvojena slova (npr. „nadživeti“ = над+живети, „konjunkcija“ = кон+јункција). Rešenje: lista izuzetaka + testovi.
- Polja koja se NIKAD ne preslovljavaju: broj šasije (VIN), registarska oznaka, email, broj računa, JMBG/brojevi, strana imena na zahtev korisnika. Svako polje u definiciji ima oznaku `bezPreslovljavanja`.
- Iznos slovima („osamsto pedeset hiljada dinara“) generiše se u latinici pa preslovljava – jedan izvor istine.
- Korisnik bira pismo i za interfejs sajta (isti mehanizam za UI tekstove).
- PDF font mora imati ćirilicu (npr. Roboto ili Noto Sans – ugrađeni u pdfmake). Izbegavati kurziv u ćirilici (srpski kurzivni oblici б, г, д, п, т se ne prikazuju ispravno u većini fontova).

## 5. Struktura projekta

```
Dokumenti/
├── CLAUDE.md                  ← pravila za Claude sesije (postoji)
├── progress.md                ← plan po fazama + dnevnik rada
├── docs/
│   ├── tehnicki-plan.md       ← ovaj fajl
│   ├── katalog-dokumenata.md  ← svi dokumenti, prioritet, pravni osnov
│   ├── euprava/               ← katalog usluga eUprave (JSON + MD) i preuzeti obrasci
│   └── pravni-tekstovi/
│       └── specifikacija-v2.md← šabloni MVP-a, AI, cene, plaćanje
└── web/                       ← Next.js aplikacija (pravi se u Fazi 1)
    └── src/
        ├── app/
        │   ├── page.tsx                   početna
        │   ├── [dokument]/page.tsx        stranica dokumenta (forma + pregled + SEO)
        │   └── api/
        │       ├── porudzbina/            kreiranje porudžbine
        │       ├── placanje/              callback banke / SMS agregatora
        │       ├── pdf/                   generisanje PDF-a posle uplate
        │       └── ai/                    očitavanje dokumenata, odredbe, predlozi
        ├── lib/
        │   ├── sabloni/                   engine: popunjavanje Handlebars šablona
        │   ├── pismo/                     latinica ↔ ćirilica + izuzeci
        │   ├── slovima/                   broj → reči (dinari, evri)
        │   └── validacija/                JMBG kontrolna cifra, VIN, PIB, MB
        │   └── pdf/                       pdfmake izgled dokumenta
        └── sabloni/
            └── kupoprodaja-vozila/
                ├── sablon.hbs             tekst ugovora
                ├── polja.ts               polja forme + validacija
                └── sadrzaj.ts             uvod, FAQ, „šta dalje“, SEO
```

`web/` se namerno ne pravi ručno sada: alat `create-next-app` u Fazi 1 pravi ga sam i ne voli da zatekne postojeće fajlove.

## 6. Bezbednost i privatnost (obavezno pre naplate)

- Podaci forme u bazi šifrovani, automatsko brisanje posle 24h.
- Fotografije za AI se ne čuvaju – obrađuju se u memoriji i odbacuju.
- Izričita saglasnost pre AI funkcija (podaci idu servisu van Srbije).
- Politika privatnosti i uslovi korišćenja pre prve naplate.
- API ključevi (Anthropic, banka) samo u Vercel env varijablama, nikad u kodu ili GitHub-u.

## 7. Šta ovaj plan NE rešava (ceka Dušana ili treće lice)

- Registrovana firma i poslovni račun (preduslov za plaćanje).
- Izbor banke prihvatioca i SMS agregatora (ponude).
- Pravni pregled šablona od strane advokata.
- Fiskalizacija – odgovor knjigovođe.
