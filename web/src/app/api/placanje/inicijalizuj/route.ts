import { NextResponse } from 'next/server';

// Plaćanje još nije aktivno: provajder (banka / SMS agregator) nije izabran, firma nije registrovana.
// Ranija simulacija (izmišljen račun, SMS broj, nepostojeća stranica za kartice) je uklonjena.
export async function POST() {
  return NextResponse.json({ error: 'Plaćanje još nije aktivno.' }, { status: 501 });
}
