/* App controller: rendering and events. Data in data.js, pure logic in logic.js. */
const $=s=>document.querySelector(s);let lang='en',cur=null,sec='what',filt='all',sf='all',dots=[];
const T=()=>U[lang];
const {C,PRI,esc,fm,calcLoss,detectIntent,filterSchemes,isLowConf}=MM;
let land='sm',trk=null;try{trk=JSON.parse(localStorage.getItem('mm_trk'))}catch(e){}
if(!trk||typeof trk.n!=='string')trk=null;

function calcH(a){const x=X[lang],r=calcLoss(a,C[D[cur].id]);return `<div><b>₹${fm(r.loss)}</b><small>${x.lose}</small></div><div><b>₹${fm(r.cost)}</b><small>${x.cost}</small></div><div><b style="color:var(--g)">₹${fm(r.save)}</b><small>${x.save}</small></div>`}
function calc(){$('#cres').innerHTML=calcH(+$('#ac').value||0)}
function extra(d){const x=X[lang];if(isLowConf(d.conf))return `<div class="card" style="border-color:var(--r)"><h4>⚠ ${x.lowt}</h4><p class="mini">${x.low}</p><a class="btn" style="margin-top:10px" href="tel:1551">📞 ${x.call} 1551</a></div>`;
return `<div class="card" style="border-color:var(--b)"><h4>${x.wait}</h4><p class="mini">${x.w}</p></div><div class="card"><h4>${x.calc}</h4><div class="row2" style="margin-bottom:8px"><span class="mini">${x.ac}</span><input id="ac" type="number" min="0" step="0.5" value="2" aria-label="${x.ac}"></div><div class="stat" id="cres">${calcH(2)}</div></div><button class="btn o" id="trkb" style="margin-bottom:10px">${x.trk}</button><a class="btn o" style="margin-bottom:12px" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(x.wam.replace('#',d.n[lang]))}">${x.wa}</a><div class="card"><h4>${x.help}</h4><p class="mini">🏛 ${x.rsk} · 1.2 km<br>🏪 ${x.shop} · 2.8 km</p></div>`}
function trkSet(){const d=D[cur];trk={n:d.n[lang]};try{localStorage.setItem('mm_trk',JSON.stringify(trk))}catch(e){}showTrk();toast('⏰ '+X[lang].trkd)}
function showTrk(){$('#trk').innerHTML=trk?`<div class="card" style="padding:10px;border-color:var(--y)"><span class="mini">⏰ ${esc(trk.n)} — ${X[lang].rc}</span></div>`:''}
function lf(){$('#lf').innerHTML=`<span style="background:none">${X[lang].lt}</span>`+Object.entries(X[lang].land).map(([k,v])=>`<button type="button" data-ld="${k}" class="${k==land?'on':''}">${v}</button>`).join('')}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('s');setTimeout(()=>t.classList.remove('s'),3500)}
function render(){const u=T();$('#tag').textContent=u.tag;$('#t_scan').textContent=u.scan;$('#t_up').textContent=u.up;
$('#nav').innerHTML=['📸','🚨','📡','🏛'].map((e,i)=>`<button type="button" data-i="${i}" class="${$('#p'+i).classList.contains('on')?'on':''}"><b>${e}</b>${u.nav[i]}</button>`).join('');
$('#samples').innerHTML=D.map((d,i)=>`<button type="button" class="sm" data-d="${i}"><i>${d.ic}</i>${d.n[lang].split('–')[0]}</button>`).join('');
$('#alerts').innerHTML=A.map(a=>`<div class="card al ${a.c}"><div class="ic">${a.ic}</div><div><h3>${a.t[lang]}</h3><p>${a.d[lang]}</p></div></div>`).join('')+`<div class="note">${u.nr.replace('Anonymous community reports','Simulated forecast')}</div>`;
$('#rf').innerHTML=[['all',u.all],...D.filter(d=>d.conf>70).map(d=>[d.id,d.ic+' '+d.n[lang].split('–')[0]])].map(([k,v])=>`<button type="button" data-f="${k}" class="${k==filt?'on':''}">${v}</button>`).join('');
$('#l1').textContent=u.l[0];$('#l2').textContent=u.l[1];$('#l3').textContent=u.l[2];$('#t_rep').textContent=u.rep;$('#n_rad').textContent=u.nr;$('#you').textContent=u.youh;
$('#q').placeholder=u.q;$('#n_sch').textContent=u.ns;
$('#sf').innerHTML=Object.entries(u.cat).map(([k,v])=>`<button type="button" data-c="${k}" class="${k==sf?'on':''}">${v}</button>`).join('');drawS();drawMap();showTrk();lf();if(cur!=null)showRes(cur)}
function drawS(){const q=$('#q').value.toLowerCase();$('#schemes').innerHTML=filterSchemes(S,{cat:sf,query:q,lang}).map(s=>`<div class="card sc"><div class="row" style="align-items:center"><h3>${s.n[lang]}</h3><span class="amt" style="text-align:right;flex:none">${s.a}</span></div><p>${s.d[lang]}</p>${PRI[land].includes(s.n.en)?`<span class="chip" style="background:var(--y);color:#2a1d00;margin-top:8px">⭐ ${X[lang].pri}</span>`:''}</div>`).join('')+`<div class="card mini">${X[lang].docs}</div>`}
function seed(){const cs={lb:[[110,80],[130,95],[100,110],[175,150]],rb:[[200,100],[220,130],[190,170]],cl:[[70,150],[90,175],[130,190]]};D.forEach(d=>(cs[d.id]||[]).forEach(([x,y])=>{for(let i=0;i<3;i++)dots.push({d:d.id,x:x+Math.random()*30-15,y:y+Math.random()*30-15,col:d.col})}))}
function drawMap(){const v=dots.filter(p=>filt=='all'||p.d==filt);$('#dots').innerHTML=v.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="5" fill="${p.col}" class="pulse"/><circle cx="${p.x}" cy="${p.y}" r="3.5" fill="${p.col}"/>`).join('');$('#s1').textContent=v.length+(filt=='all'?18:3);$('#s2').textContent=v.length*4+7;$('#s3').textContent=filt=='all'?'🍅':(D.find(d=>d.id==filt)||{}).ic}
function showRes(i){cur=i;const d=D[i],u=T(),sv=['#8cf06a','#ffc94d','#ff6b5b'][d.sev];speechSynthesis.cancel();
$('#res').innerHTML=`<div class="card"><div class="row" style="align-items:center;gap:14px"><div class="ring" style="--p:${d.conf};flex:none;width:84px"><div>${d.conf}%</div></div><div style="flex:3"><div class="sub">${d.ic} ${u.conf}</div><h2 style="font-size:19px;margin:3px 0 6px">${d.n[lang]}</h2><span class="chip" style="background:${sv};color:#111">${u.sev[d.sev]}</span></div></div>
<div class="tabs" id="st">${Object.entries(u.sec).map(([k,v])=>`<button type="button" data-s="${k}" class="${k==sec?'on':''}">${v}</button>`).join('')}</div>
<p style="font-size:15px;line-height:1.6;min-height:96px" id="body">${d[sec][lang]}</p>
<div class="row" style="align-items:center;margin-top:10px"><button class="btn" id="lis">${u.listen}</button><div class="wave" style="flex:none;width:90px"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div></div>${extra(d)}`}
function speak(){const d=D[cur],u=T();if(speechSynthesis.speaking){speechSynthesis.cancel();return}
const txt=['what','why','treat','prev'].map(k=>u.sec[k]+'. '+d[k][lang]).join(' ');const m=new SpeechSynthesisUtterance(d.n[lang]+'. '+txt);m.lang={en:'en-IN',te:'te-IN',hi:'hi-IN'}[lang];m.rate=.92;
m.onstart=()=>{$('#res').classList.add('speak');$('#lis').textContent=u.stop};m.onend=m.onerror=()=>{$('#res').classList.remove('speak');const b=$('#lis');if(b)b.textContent=u.listen};speechSynthesis.speak(m)}
function analyze(i,img){const h=$('#hero');h.classList.add('scan');$('#res').innerHTML='<div class="note">🔬 ...</div>';
if(img)h.innerHTML='<img alt="Uploaded plant photo" src="'+img+'"><div class="laser"></div>';setTimeout(()=>{h.classList.remove('scan');showRes(i);if(isLowConf(D[i].conf))toast(T().warn)},1800)}
document.addEventListener('click',e=>{const t=e.target.closest('[data-l],[data-i],[data-d],[data-s],[data-f],[data-c],#lis,#cam,#up,#rep');if(!t)return;
if(t.dataset.l){lang=t.dataset.l;document.querySelectorAll('#lang button').forEach(b=>b.classList.toggle('on',b==t));speechSynthesis.cancel();render()}
else if(t.dataset.i){document.querySelectorAll('.pg').forEach((p,i)=>p.classList.toggle('on',i==t.dataset.i));render();if(t.dataset.i==1)setTimeout(()=>toast('🌊 '+A[0].t[lang]),600)}
else if(t.dataset.d!=null){const d=D[+t.dataset.d];$('#hero').innerHTML=`<svg viewBox="0 0 200 140"><rect width="200" height="140" fill="#0b2315"/><path d="M100 14C160 36 168 100 100 128 32 100 40 36 100 14Z" fill="${d.id=='lb'?'#4f9a45':d.id=='rb'?'#9bb84a':'#5fae55'}"/>${[1,2,3,4,5,6,7].map(i=>`<circle cx="${70+Math.random()*60}" cy="${40+Math.random()*70}" r="${4+Math.random()*7}" fill="${d.col}" opacity=".8"/>`).join('')}</svg><div class="laser"></div>`;analyze(+t.dataset.d)}
else if(t.dataset.s){sec=t.dataset.s;showRes(cur)}
else if(t.dataset.f){filt=t.dataset.f;render()}
else if(t.dataset.c){sf=t.dataset.c;render()}
else if(t.id=='lis')speak();
else if(t.id=='cam'||t.id=='up')$('#file').click();
else if(t.id=='rep'){const d=filt=='all'?'lb':filt,x=D.find(k=>k.id==d);dots.push({d,x:150+Math.random()*50-25,y:125+Math.random()*50-25,col:x.col});drawMap();toast('✅ '+T().rpt)}});
$('#file').onchange=e=>{const f=e.target.files[0];if(!f||!f.type.startsWith('image/')||f.size>10e6)return;const r=new FileReader();r.onload=()=>analyze(f.size%3,r.result);r.readAsDataURL(f)};
let qt;$('#q').oninput=()=>{clearTimeout(qt);qt=setTimeout(drawS,150)};
render();seed();drawMap();
document.querySelectorAll('.spb').forEach(b=>b.onclick=()=>{lang=b.dataset.sp;document.querySelectorAll('#lang button').forEach(x=>x.classList.toggle('on',x.dataset.l==lang));$('#spl').classList.add('h');render()});
document.addEventListener('click',e=>{const t=e.target.closest('[data-ld]');if(t){land=t.dataset.ld;render()}});
function net(){$('#net').textContent=navigator.onLine?'● Online':'📴 Offline · still works'}net();addEventListener('online',net);addEventListener('offline',net);
const LC={en:'en-IN',te:'te-IN',hi:'hi-IN'};
function say(a){speechSynthesis.cancel();const m=new SpeechSynthesisUtterance(a);m.lang=LC[lang];speechSynthesis.speak(m)}
function ask(q){const k=detectIntent(q);const a=X[lang].a[k];$('#ans').textContent=a;say(a)}
$('#fab').onclick=()=>{$('#ask').classList.add('o');$('#askt').textContent=X[lang].ask;$('#aq').placeholder=X[lang].ph;$('#ans').textContent=X[lang].a.def};
$('#askx').onclick=()=>{$('#ask').classList.remove('o');speechSynthesis.cancel()};
$('#go').onclick=()=>ask($('#aq').value);$('#aq').onkeydown=e=>{if(e.key=='Enter')ask(e.target.value)};
$('#mic').onclick=()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){toast(X[lang].nos);return}const r=new SR();r.lang=LC[lang];r.onresult=e=>{const q=e.results[0][0].transcript;$('#aq').value=q;ask(q)};r.onerror=()=>toast(X[lang].nos);r.start();$('#ans').textContent='🎙 …'};

/* ---- accessibility, events, offline ---- */
function a11y(){document.documentElement.lang=lang;document.querySelectorAll('.tabs button,#lang button').forEach(b=>b.setAttribute('aria-pressed',String(b.classList.contains('on'))));document.querySelectorAll('nav button').forEach(b=>b.classList.contains('on')?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current'));$('#q').setAttribute('aria-label',T().q);$('#aq').setAttribute('aria-label',X[lang].ph)}
new MutationObserver(a11y).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});a11y();
document.addEventListener('click',e=>{if(e.target.closest('#trkb'))trkSet()});
document.addEventListener('input',e=>{if(e.target.id=='ac')calc()});
if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol)&&!document.querySelector('meta[name=mm-inline]'))navigator.serviceWorker.register('sw.js').catch(()=>{});
