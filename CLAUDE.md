# CLAUDE.md — Projekat "Dokumenti"

> Ovaj fajl čita svaka Claude sesija koja radi u ovom folderu. Sadrži šta je projekat, šta je odlučeno, šta NIJE odlučeno, i kako se radi na njemu. Ne izmišljaj ništa što ovde ne piše — ako fali, pitaj Dušana.
> **Napredak i sledeći korak: `progress.md`** — pročitaj ga PRE rada, ažuriraj POSLE svakog koraka.

## 1. Šta je projekat

Web aplikacija za generisanje pravnih dokumenata (ugovori, obrasci, izjave) za srpsko tržište, sa izvozom u PDF. Model i direktni konkurent: **dokumenta.rs**.

Korisnik popuni formu → aplikacija generiše gotov pravni dokument → korisnik plati → preuzme PDF.

## 2. Šta je ODLUČENO (ne menjati bez Dušanove reči)

- **Monetizacija:** pay-per-document (plaćanje po dokumentu), NE pretplata.
- **Cena:** 149 RSD dokument, 199 RSD dokument + AI (odlučeno 21.09.2026).
- **Način plaćanja:** redosled IPS QR → SMS (agregator) → kartice. Konkretan provajder još nije izabran (sekcija 4). Stripe ne podržava Srbiju.
- **Obim (scope):**
  - Nepokretnosti (promet nepokretnosti) su **isključene**. Izuzetak koji JE u obimu: saglasnost vlasnika stana za prijavu prebivališta/boravišta (nije promet).
  - Za prenos vlasništva nad vozilom, rok se navodi kao **30 dana**.
  - Sve usluge sa eUprave ulaze u aplikaciju kao sekcija „Državne usluge“ (brzi pronalazak, opis, uslovi, takse, link, obrasci za popunjavanje kod kuće). Izvor: `docs/euprava/`.
- **Pismo:** svaki dokument i UI u latinici i ćirilici (izbor korisnika). Detalji: `docs/tehnicki-plan.md` sekcija 4.
- **Jezik proizvoda:** srpski (dokumenti, UI, pravna terminologija).
- **Tehnološki stack (odlučeno 21.09.2026):** Next.js (App Router) + TypeScript + Tailwind; šabloni Handlebars + Zod; PDF pdfmake na SERVERU (tek posle uplate); PostgreSQL preko Supabase (EU); AI preko Anthropic API (samo sa servera); hosting Vercel (Frankfurt); repo `arhistrategstudio/dokumenti`; aplikacija u podfolderu `web/`. Detalji: `docs/tehnicki-plan.md`.

## 3. Plaćeni AI dodatak (paid add-on)

AI funkcije su odvojena, naplativa nadogradnja iznad osnovnog generisanja dokumenta:
- Popunjavanje formi na osnovu priloženih dokumenata (izvlačenje podataka).
- AI strukturiranje "posebnih odredbi" koje korisnik napiše slobodnim tekstom u pravni oblik.
- AI predlaganje teksta odredbi.

Osnovni tok (forma → dokument → PDF) mora raditi i BEZ AI-ja. AI je nadogradnja, ne zavisnost.

## 4. Šta NIJE odlučeno (otvorena pitanja — ne pretpostavljati)

- Konkretan SMS/payment provajder (čeka ponude banaka i agregatora).
- Pravni izvor/validacija sadržaja dokumenata (advokat – još nije angažovan).
- Registracija firme i fiskalizacija (Dušan + knjigovođa).

Kad se neka od ovih stavki odluči, prebaci je u sekciju 2 ("Odlučeno") i ovde je ukloni.

## 5. Kako se radi na ovom projektu (za Claude sesije)

- **Dušan je početnik u hands-on razvoju.** Objašnjavaj korake konkretno, bez pretpostavljenog znanja o dev alatima. Kratko na srpskom objasni šta se radi i zašto pre nečeg novog — bez predavanja.
- **Radi umesto da savetuješ:** izvršavaj korake direktno (terminal/fajlovi/alati). Dušanu ostavi samo ono što traži njegovu lozinku, potpis, način plaćanja, ili odluku koju Claude ne sme sam da donese.
- **Ne izmišljaj:** funkcije, module, putanje, env varijable, framework-e. Ako nešto nije jasno ili fali → STANI i pitaj.
- **Poštuj scope:** ne dodaji "ekstra" funkcije koje niko nije tražio.
- **Pravni sadržaj je osetljiv:** dokumenti moraju biti pravno tačni. Ne izmišljaj članove zakona, rokove ili formulacije. Ako nisi siguran u pravnu ispravnost teksta, označi to jasno.
- **Nikad ne testiraj destruktivne operacije na pravim podacima** — napravi bezbednu kopiju/test objekat.
- **Svaki zadatak završi konkretnim deliverable-om:** gotovi fajlovi, linkovi, ID-jevi — spremni za predaju.
- **Posle svakog koraka ažuriraj `progress.md`** (Dnevnik + Sledeći korak).

## 6. Konvencije

- GitHub repozitorijum: `arhistrategstudio/doQ-menti`.
- Komunikacija i objašnjenja: srpski.
- Na kraju koraka daj tačan "šta da otkucaš" blok kad vodiš Dušana kroz proces.

---
*Ovaj fajl je živ dokument. Ažuriraj ga kad se donesu odluke — da naredna sesija ne kreće od nule.*
