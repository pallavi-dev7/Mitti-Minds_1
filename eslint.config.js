const js = require('@eslint/js');
const browser = Object.fromEntries(['window','document','navigator','localStorage','location','speechSynthesis','SpeechSynthesisUtterance','FileReader','MutationObserver','self','caches','clients','fetch','module','addEventListener','setTimeout','clearTimeout'].map((k) => [k, 'readonly']));
module.exports = [
  js.configs.recommended,
  { files: ['src/**/*.js', 'sw.js'], languageOptions: { sourceType: 'script', globals: browser }, rules: { 'no-undef': 'off', 'no-unused-vars': 'off', 'no-empty': 'off' } },
  { files: ['tests/**', 'scripts/**', 'eslint.config.js'], languageOptions: { sourceType: 'commonjs', globals: { require: 'readonly', module: 'writable', __dirname: 'readonly', console: 'readonly' } } },
];
