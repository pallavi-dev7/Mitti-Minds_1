/* Pure, testable logic (no DOM). Works in the browser (window.MM) and Node (require). */
(function (root, factory) {
  const m = factory();
  if (typeof module === 'object' && module.exports) module.exports = m;
  else root.MM = m;
})(typeof self !== 'undefined' ? self : this, function () {
  // [loss per acre if untreated, treatment cost per acre] in INR (illustrative estimates)
  const C = { lb: [40000, 1800], rb: [25000, 1200], cl: [30000, 2500], un: [0, 0] };
  // schemes with priority by land size
  const PRI = {
    sm: ['PM-KISAN', 'PMFBY Crop Insurance', 'PM-KUSUM Solar Pumps', 'Micro-Irrigation (Drip/Sprinkler)', 'Soil Health Card'],
    md: ['PM-KISAN', 'Kisan Credit Card', 'PMFBY Crop Insurance', 'Micro-Irrigation (Drip/Sprinkler)'],
    lg: ['Kisan Credit Card', 'Agri Infrastructure Fund', 'PM-KUSUM Solar Pumps'],
  };
  const INTENTS = {
    spray: /spray|rain|medicine|మందు|పిచికారీ|స్ప్రే|వర్ష|बारिश|छिड़|दवा/,
    loan: /loan|credit|kcc|bank|రుణ|ఋణ|బ్యాంకు|ऋण|कर्ज/,
    ins: /insur|బీమా|बीमा/,
    flood: /flood|వరద|बाढ़/,
    dis: /disease|leaf|scan|తెగులు|ఆకు|रोग|पत्ती/,
  };
  const ENT = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ENT[c]);
  const fm = (n) => Math.round(n).toLocaleString('en-IN');
  const calcLoss = (acres, [loss, cost]) => {
    const a = Math.min(Math.max(Number(acres) || 0, 0), 10000);
    return { loss: a * loss, cost: a * cost, save: a * (loss - cost) };
  };
  const detectIntent = (q) => {
    const t = String(q || '').toLowerCase();
    for (const k in INTENTS) if (INTENTS[k].test(t)) return k;
    return 'def';
  };
  const filterSchemes = (list, { cat = 'all', query = '', lang = 'en' } = {}) => {
    const q = String(query).toLowerCase();
    return list.filter((s) => (cat === 'all' || s.k === cat) && (s.n[lang] + s.d[lang] + s.n.en).toLowerCase().includes(q));
  };
  const isLowConf = (c) => c < 70;
  return { C, PRI, INTENTS, esc, fm, calcLoss, detectIntent, filterSchemes, isLowConf };
});
