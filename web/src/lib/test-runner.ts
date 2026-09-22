import { brojSlovima } from './slovima';
import { presloviTekst, presloviObjekat } from './pismo';
import { validirajJMBG, validirajVIN, validirajRegistarskuOznaku } from './validacija';
import { popuniSablon } from './sabloni';

console.log('=== POKRETANJE TESTOVA MOTORA DOKUMENATA ===\n');

// 1. Testovi za broj u reči (slovima)
console.log('1. Test: brojSlovima');
const t1 = brojSlovima(150000, 'RSD');
console.log('   150.000 RSD ->', t1);
if (!t1.includes('sto pedeset hiljada dinara')) throw new Error('Test 1 failed');

const t2 = brojSlovima(1, 'EUR');
console.log('   1 EUR ->', t2);
if (t2 !== 'jedan evro') throw new Error('Test 2 failed');

const t3 = brojSlovima(22004, 'RSD');
console.log('   22.004 RSD ->', t3);
if (!t3.includes('dvadeset dve hiljade četiri dinara')) throw new Error('Test 3 failed');

console.log('   -> Svi testovi za slovima su PROŠLI!\n');

// 2. Testovi za preslovljavanje (pismo)
console.log('2. Test: presloviTekst & presloviObjekat');
const tekstLat = 'Ugovor o kupoprodaji motornog vozila u Beogradu. Injekcija i nadživeti.';
const tekstCir = presloviTekst(tekstLat, 'cirilica');
console.log('   Lat -> Cir:', tekstCir);
if (!tekstCir.includes('Уговор о купопродаји моторног возила у Београду')) throw new Error('Pismo test 1 failed');
if (!tekstCir.includes('Инјекција') || !tekstCir.includes('надживети')) throw new Error('Pismo izuzeci failed');

const obj = {
  ime: 'Petar Petrović',
  vin: 'WAUZZZ8V1GA123456',
  registracija: 'BG1234AB'
};
const objCir = presloviObjekat(obj, 'cirilica');
console.log('   Objekat u ćirilici:', objCir);
if (objCir.vin !== 'WAUZZZ8V1GA123456' || objCir.registracija !== 'BG1234AB') throw new Error('Preslovljavanje ignorisanih polja failed');
console.log('   -> Svi testovi za pismo su PROŠLI!\n');

// 3. Testovi za validaciju
console.log('3. Test: validacija');
console.log('   Validacija VIN (WAUZZZ8V1GA123456):', validirajVIN('WAUZZZ8V1GA123456'));
if (!validirajVIN('WAUZZZ8V1GA123456')) throw new Error('VIN validacija failed');
if (validirajVIN('WAUZZZ8V1GA12345I')) throw new Error('VIN sa I ne sme proći');

console.log('   Validacija registracije (BG1234AB):', validirajRegistarskuOznaku('BG1234AB'));
if (!validirajRegistarskuOznaku('BG1234AB')) throw new Error('Registracija validacija failed');
console.log('   -> Svi testovi validacije su PROŠLI!\n');

// 4. Testovi za popunjavanje šablona
console.log('4. Test: popuniSablon');
const sampleTemplate = 'Ugovor zaključen u {{mestoZakljucenja}}, dana {{formatDatum datumZakljucenja}}. Iznos: {{formatIznos cenaIznos}} {{cenaValuta}} (slovima: {{slovima cenaIznos cenaValuta}}).';
const sampleData = {
  mestoZakljucenja: 'Beogradu',
  datumZakljucenja: '2026-09-22',
  cenaIznos: 450000,
  cenaValuta: 'RSD'
};
const renderedLat = popuniSablon(sampleTemplate, sampleData, { pismo: 'latinica' });
console.log('   Renderovan ugovor (latinica):', renderedLat);

const renderedCir = popuniSablon(sampleTemplate, sampleData, { pismo: 'cirilica' });
console.log('   Renderovan ugovor (ćirilica):', renderedCir);
if (!renderedCir.includes('Београду') || !renderedCir.includes('четиристо педесет хиљада динара')) throw new Error('Sablon render test failed');
console.log('   -> Svi testovi šablona su PROŠLI!\n');

console.log('==============================================');
console.log('SVI UNIT TESTOVI MOTORA SU USPEŠNO PROŠLI! ✓');
console.log('==============================================');
