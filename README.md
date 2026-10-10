# 🌱 Mitti Minds

**An AI crop-doctor for farmers, in their own language.** Snap a photo of a sick plant and hear what the disease is, why it happens, how to treat and how to prevent it, in Telugu, Hindi or English.

**Live demo:** https://YOUR-USERNAME.github.io/mitti-minds/

## Problem
Farmers lose large parts of their harvest to diseases noticed too late. Expert help is hard to reach and most agri-tech tools are not in regional languages.

## Features
Photo scan with confidence and severity · voice explanation (what / why / treat / prevent) · low-confidence fallback with one-tap call to Kisan Call Centre 1551 · spray-or-wait advisor · loss vs treatment cost calculator · voice assistant · weather and disaster alerts · community disease radar · government schemes with search and land-size priorities · 5-day rescan reminder · WhatsApp alert to neighbours · installable and works offline (PWA).

## Architecture
```
index.html          markup + strict CSP
styles.css          design system (CSS variables, reduced-motion, focus styles)
src/data.js         content: diseases, alerts, schemes, UI strings (3 languages)
src/logic.js        pure functions: esc, calcLoss, detectIntent, filterSchemes (unit-tested)
src/app.js          rendering + events + accessibility wiring
sw.js, manifest     offline cache and installability
tests/              node:test unit and data-integrity tests
scripts/            build-single.js (inline everything into one file)
```
No framework, no build step required, no runtime dependencies.

## Quality
- **Tests:** `npm test` runs 15 tests (logic, input validation, intent detection in 3 languages, translation completeness). CI runs on every push; Pages deploy is gated on tests.
- **Accessibility:** real `<button>` controls, `aria-pressed/current/live`, labelled inputs, `lang` follows the selected language, visible focus, `prefers-reduced-motion`, large touch targets, voice output for low-literacy users.
- **Security:** CSP with `script-src 'self'`, no inline handlers, HTML escaping, validated localStorage, image-only uploads under 10 MB. See `SECURITY.md`.
- **Efficiency:** about 50 KB total, zero dependencies, debounced search, service-worker cache for offline use.

## Run
`npm test` · open `index.html` (use a local server, e.g. `npx serve`, to enable the service worker) · `npm run build` for a single-file build in `dist/`.

## Honest status (prototype)
- Disease detection is **simulated**. Plan: MobileNetV3 fine-tuned on PlantDoc/PlantWild, exported to TFLite/ONNX for on-device inference.
- Weather, radar and nearby-help data are **samples**. Plan: IMD/OpenWeather APIs and an anonymous reports database.
- Voice Q&A is keyword-based. Plan: an LLM grounded in verified advisories.
- Scheme amounts are approximate; treatment advice needs agronomist validation.

## Roadmap
Real ML model · Bhashini translation/TTS · more crops and languages · SMS/WhatsApp alerts · official scheme APIs.

MIT License
