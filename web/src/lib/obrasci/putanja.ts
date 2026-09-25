import path from 'path';
import katalog from '@/data/katalog-obrazaca.json';

type Kat = { name: string; items: { file: string; source: string }[] };

// Vraća apsolutnu putanju do originalnog obrasca ili null.
// Dozvoljeni su samo fajlovi iz kataloga (sprečava čitanje proizvoljnih fajlova sa servera).
export function putanjaObrasca(izvor: string | null, kategorija: string, fajl: string): string | null {
  if (!fajl || !izvor) return null;
  if (/[\\/]/.test(fajl) || /[\\/]/.test(kategorija) || kategorija.includes('..')) return null;
  const uKatalogu = (katalog as Kat[]).some(
    (k) => (izvor === 'euprava' || k.name === kategorija) && k.items.some((i) => i.source === izvor && i.file === fajl)
  );
  if (!uKatalogu) return null;

  const docsDir = path.resolve(process.cwd(), '..', 'docs');
  let p = '';
  if (izvor === 'paragraf') p = path.resolve(docsDir, 'obrasci-paragraf', kategorija, fajl);
  else if (izvor === 'drzavni') p = path.resolve(docsDir, 'obrasci-mup-drzavni', kategorija, fajl);
  else if (izvor === 'euprava') p = path.resolve(docsDir, 'euprava', 'obrasci', fajl);
  return p.startsWith(docsDir + path.sep) ? p : null;
}
