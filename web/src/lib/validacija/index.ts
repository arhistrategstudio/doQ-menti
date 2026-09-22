export function validirajJMBG(jmbg: string): boolean {
  if (!jmbg || typeof jmbg !== 'string') return false;
  const clean = jmbg.trim();
  if (!/^\d{13}$/.test(clean)) return false;

  const a = parseInt(clean[0], 10);
  const b = parseInt(clean[1], 10);
  const v = parseInt(clean[2], 10);
  const g = parseInt(clean[3], 10);
  const d = parseInt(clean[4], 10);
  const dj = parseInt(clean[5], 10);
  const e = parseInt(clean[6], 10);
  const z = parseInt(clean[7], 10);
  const zi = parseInt(clean[8], 10);
  const i = parseInt(clean[9], 10);
  const j = parseInt(clean[10], 10);
  const k = parseInt(clean[11], 10);
  const l = parseInt(clean[12], 10);

  const suma = 7 * a + 6 * b + 5 * v + 4 * g + 3 * d + 2 * dj + 7 * e + 6 * z + 5 * zi + 4 * i + 3 * j + 2 * k;
  const ostatak = suma % 11;

  let kontrolna = 0;
  if (ostatak === 0) {
    kontrolna = 0;
  } else if (ostatak >= 2 && ostatak <= 10) {
    kontrolna = 11 - ostatak;
  } else {
    // Ako je ostatak 1, JMBG je nevažeći
    return false;
  }

  return kontrolna === l;
}

export function validirajVIN(vin: string): boolean {
  if (!vin || typeof vin !== 'string') return false;
  const clean = vin.trim().toUpperCase();
  // VIN ima 17 alfanumeričkih znakova i ne sme sadržati slova I, O, Q
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(clean)) {
    return false;
  }
  return true;
}

export function validirajPIB(pib: string): boolean {
  if (!pib || typeof pib !== 'string') return false;
  const clean = pib.trim();
  if (!/^\d{9}$/.test(clean)) return false;

  let suma = 10;
  for (let i = 0; i < 8; i++) {
    suma = (suma + parseInt(clean[i], 10)) % 10;
    if (suma === 0) suma = 10;
    suma = (suma * 2) % 11;
  }
  const kontrolna = (11 - suma) % 10;
  return kontrolna === parseInt(clean[8], 10);
}

export function validirajMaticniBroj(mb: string): boolean {
  if (!mb || typeof mb !== 'string') return false;
  const clean = mb.trim();
  if (!/^\d{8}$/.test(clean)) return false;

  const ponderi = [7, 6, 5, 4, 3, 2, 7];
  let suma = 0;
  for (let i = 0; i < 7; i++) {
    suma += parseInt(clean[i], 10) * ponderi[i];
  }
  const ostatak = suma % 11;
  let kontrolna = 0;
  if (ostatak === 0) kontrolna = 0;
  else if (ostatak >= 2 && ostatak <= 10) kontrolna = 11 - ostatak;
  else return false;

  return kontrolna === parseInt(clean[7], 10);
}

export function validirajRegistarskuOznaku(reg: string): boolean {
  if (!reg || typeof reg !== 'string') return false;
  const clean = reg.trim().toUpperCase().replace(/[\s-]/g, '');
  return /^[A-ZČĆŠĐŽ]{2}\d{3,5}[A-ZČĆŠĐŽ]{0,2}$/.test(clean);
}
