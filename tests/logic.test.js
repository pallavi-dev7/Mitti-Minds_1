const test = require('node:test');
const assert = require('node:assert/strict');
const MM = require('../src/logic.js');
const { U, D, A, S, X } = require('../src/data.js');
const L = ['en', 'te', 'hi'];
const shape = (o) => (typeof o === 'object' ? Object.keys(o).sort().map((k) => k + ':' + shape(o[k])).join(',') : 'v');

test('esc neutralises HTML', () => {
  assert.equal(MM.esc('<img onerror=1>'), '&lt;img onerror=1&gt;');
  assert.equal(MM.esc('a"b\'c&'), 'a&quot;b&#39;c&amp;');
  assert.equal(MM.esc(null), '');
});
test('fm uses Indian grouping', () => assert.equal(MM.fm(1234567), '12,34,567'));
test('calcLoss basic', () => assert.deepEqual(MM.calcLoss(2, [40000, 1800]), { loss: 80000, cost: 3600, save: 76400 }));
test('calcLoss rejects negative / NaN input', () => {
  assert.deepEqual(MM.calcLoss(-5, [10, 1]), { loss: 0, cost: 0, save: 0 });
  assert.deepEqual(MM.calcLoss('abc', [10, 1]), { loss: 0, cost: 0, save: 0 });
});
test('calcLoss clamps absurd acreage', () => assert.equal(MM.calcLoss(1e9, [1, 0]).loss, 10000));
test('intent: spray in 3 languages', () => {
  for (const q of ['Can I spray today?', 'ఈరోజు పిచికారీ చేయవచ్చా', 'क्या आज छिड़काव कर सकता हूं']) assert.equal(MM.detectIntent(q), 'spray');
});
test('intent: loan / insurance / flood / disease', () => {
  assert.equal(MM.detectIntent('I need a loan'), 'loan');
  assert.equal(MM.detectIntent('రుణం కావాలి'), 'loan');
  assert.equal(MM.detectIntent('फसल बीमा'), 'ins');
  assert.equal(MM.detectIntent('వరద వస్తుందా'), 'flood');
  assert.equal(MM.detectIntent('leaf problem'), 'dis');
});
test('intent: default and empty input', () => {
  assert.equal(MM.detectIntent('hello'), 'def');
  assert.equal(MM.detectIntent(''), 'def');
  assert.equal(MM.detectIntent(undefined), 'def');
});
test('filterSchemes by category', () => {
  assert.equal(MM.filterSchemes(S, { cat: 'all' }).length, S.length);
  assert.equal(MM.filterSchemes(S, { cat: 'loan' }).length, 2);
  assert.equal(MM.filterSchemes(S, { cat: 'sub' }).length, 3);
});
test('filterSchemes by search text in English and Telugu', () => {
  assert.equal(MM.filterSchemes(S, { query: 'solar', lang: 'en' }).length, 1);
  assert.equal(MM.filterSchemes(S, { query: 'బీమా', lang: 'te' }).length, 1);
  assert.equal(MM.filterSchemes(S, { query: 'zzz' }).length, 0);
});
test('isLowConf threshold', () => {
  assert.ok(MM.isLowConf(52));
  assert.ok(!MM.isLowConf(70));
});
test('every land-size priority list names a real scheme', () => {
  const names = S.map((s) => s.n.en);
  for (const k in MM.PRI) for (const n of MM.PRI[k]) assert.ok(names.includes(n), n);
});
test('every disease is fully translated and has cost data', () => {
  for (const d of D) {
    assert.ok(d.conf >= 0 && d.conf <= 100);
    assert.ok(MM.C[d.id], d.id);
    for (const k of ['n', 'what', 'why', 'treat', 'prev']) for (const l of L) assert.ok(typeof d[k][l] === 'string' && d[k][l].length > 3, d.id + k + l);
  }
});
test('every scheme and alert is translated', () => {
  for (const s of S) for (const l of L) assert.ok(s.n[l] && s.d[l]);
  for (const a of A) for (const l of L) assert.ok(a.t[l] && a.d[l]);
});
test('UI string tables have identical keys in all languages', () => {
  for (const l of ['te', 'hi']) {
    assert.equal(shape(U[l]), shape(U.en), 'U.' + l);
    assert.equal(shape(X[l]), shape(X.en), 'X.' + l);
  }
});
