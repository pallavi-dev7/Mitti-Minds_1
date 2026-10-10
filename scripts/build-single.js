// Inlines CSS + JS into dist/mitti-minds-single.html (for hosts that need one file).
const fs = require('fs'), p = require('path');
const r = (f) => fs.readFileSync(p.join(__dirname, '..', f), 'utf8');
let h = r('index.html');
h = h.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>\s*/, () => '<meta name="mm-inline" content="1">');
h = h.replace('<link rel="stylesheet" href="styles.css">', () => '<style>' + r('styles.css') + '</style>');
h = h.replace(/<link rel="(manifest|icon)"[^>]*>\s*/g, '');
const js = ['src/data.js', 'src/logic.js', 'src/app.js'].map(r).join('\n');
h = h.replace(/(<script src="src\/[^"]+"><\/script>\s*)+/, () => '<script>' + js + '</script>');
fs.mkdirSync(p.join(__dirname, '..', 'dist'), { recursive: true });
fs.writeFileSync(p.join(__dirname, '..', 'dist', 'mitti-minds-single.html'), h);
console.log('built', h.length, 'bytes');
