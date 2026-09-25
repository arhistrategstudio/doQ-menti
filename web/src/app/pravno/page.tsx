import React from "react";
import Link from "next/link";

export const metadata = { title: "Pravne informacije — doQ-menti" };

function Odeljak({ id, naslov, children }: { id: string; naslov: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-2xl p-6 sm:p-8 backdrop-blur-sm" style={{ backgroundColor: "rgba(20,46,33,0.45)", border: "1px solid rgba(201,168,76,0.25)" }}>
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: "#F8F4EE" }}>{naslov}</h2>
      <div className="mt-2 h-px w-16" style={{ backgroundColor: "#C9A84C" }} />
      <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "rgba(248,244,238,0.82)" }}>{children}</div>
    </section>
  );
}

export default function PravnoPage() {
  return (
    <div className="relative min-h-screen pb-20" style={{ color: "#F8F4EE" }}>
      <div className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/background-doc.jpg')" }} />
      <div className="fixed inset-0 -z-10" style={{ background: "linear-gradient(180deg, rgba(10,18,13,0.90) 0%, rgba(10,18,13,0.86) 50%, rgba(10,18,13,0.94) 100%)" }} />

      <header className="sticky top-0 z-30 border-b backdrop-blur-md" style={{ backgroundColor: "rgba(26,58,42,0.55)", borderColor: "rgba(201,168,76,0.2)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-xl flex items-center gap-2" style={{ color: "#F8F4EE" }}>
            <img src="/logo.png" alt="Logo" className="h-9 w-auto object-contain" />
            <span>do<span style={{ color: "#C9A84C" }}>Q</span>-menti</span>
          </Link>
          <Link href="/" className="text-xs font-semibold hover:opacity-80" style={{ color: "#C9A84C" }}>← Početna</Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "#F8F4EE" }}>Pravne informacije</h1>
        <p className="mt-2 text-sm" style={{ color: "rgba(248,244,238,0.7)" }}>
          Obavezne informacije za korišćenje i naplatu usluga. Sadržaj u uglastim zagradama [ ] mora popuniti registrovani privredni subjekt uz proveru advokata pre puštanja naplate.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 space-y-6">
        <Odeljak id="pruzalac" naslov="Podaci o pružaocu usluge">
          <p>Naziv: [naziv privrednog subjekta] · Matični broj: [MB] · PIB: [PIB] · Sedište: [adresa] · E-pošta: [email] · Telefon: [telefon].</p>
          <p>Nadležni organ / registar: [APR i dr.]. Delatnost: pružanje online usluge generisanja dokumenata.</p>
        </Odeljak>

        <Odeljak id="uslovi" naslov="Uslovi korišćenja">
          <p>Korišćenjem aplikacije prihvatate ove uslove. Usluga se naplaćuje po dokumentu; cena i obim su prikazani pre plaćanja.</p>
          <p>[Opis usluge, obaveze korisnika, ograničenje odgovornosti, intelektualna svojina, izmene uslova, nadležnost i merodavno pravo — finalizuje advokat.]</p>
        </Odeljak>

        <Odeljak id="placanje" naslov="Plaćanje, reklamacije i pravo na odustanak">
          <p>Cene su u dinarima (RSD) sa uključenim PDV-om (ako je obveznik PDV-a). Plaćanje još nije aktivno (test verzija).</p>
          <p>Reklamacije se podnose na [email] u roku od [•] dana; odgovor u zakonskom roku. Za digitalni sadržaj isporučen odmah, pravo na odustanak može biti isključeno u skladu sa Zakonom o zaštiti potrošača uz izričitu saglasnost korisnika — [potvrditi formulaciju s advokatom].</p>
          <p>[Politika povraćaja sredstava i uslovi.]</p>
        </Odeljak>

        <Odeljak id="privatnost" naslov="Politika privatnosti">
          <p>Rukovalac podacima: [naziv subjekta]. Obrađujemo podatke neophodne za izradu dokumenta i naplatu.</p>
          <p>Podaci unešeni u korisnički profil čuvaju se lokalno u pregledaču korisnika. [Pravni osnov, rok čuvanja, prava lica, obrađivači/platni procesor, kontakt za zaštitu podataka — u skladu sa ZZPL/GDPR, finalizuje advokat.]</p>
        </Odeljak>

        <Odeljak id="kolacici" naslov="Politika kolačića">
          <p>Koristimo neophodne kolačiće za rad aplikacije. [Analitički/marketinški kolačići i saglasnost — dopuniti ako se koriste.]</p>
        </Odeljak>
      </div>
    </div>
  );
}
