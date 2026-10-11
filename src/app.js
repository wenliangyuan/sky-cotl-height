
/* ===================== 通用 ===================== */
const $=id=>document.getElementById(id);
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE   = matchMedia('(hover:hover) and (pointer:fine)').matches;
const LS_LANG='skyLang2', LS_CAT='skyCat2', LS_THEME='skyTheme2';

/* Hero 文案（按分类 + 语言） */
const HERO={
  qr:{ zh:{k:'Sky · QR Height', t:'外观 QR <b>身高</b> 查询', s:'上传游戏内「外观 QR」截图或粘贴 o= 网址，本地即时计算你的身高。'},
       en:{k:'Sky · QR Height', t:'Outfit QR <b>Height</b>', s:'Upload the in-game Outfit QR screenshot or paste the o= URL to compute your height locally.'} },
  cbg:{ zh:{k:'Sky · CBG 身高', t:'藏宝阁 <b>身高</b> 提取', s:'粘贴藏宝阁商品链接，读取体型 / 身高，算出当前 / 最高 / 最矮 / 矮人面具 身高，并检测无翼。'},
        en:{k:'Sky · CBG Height', t:'CBG <b>Height</b> Extractor', s:'Paste a CBG item link to read scale / height, compute current / tallest / shortest / dwarf-mask height, and detect wingless.'} }
};
let currentCat='qr', lang='zh';

/* 语言包 */
const I18N={ zh:{
    catQr:'外观 QR', catCbg:'藏宝阁',
    calc:'开始计算', upload:'扫码上传', url:'粘贴网址', placeholder:'粘贴完整网址，例如 https://sky.thatg.co/o=...',
    drop_b:'点击或拖拽截图到此处', drop_s:'也可直接粘贴截图（Ctrl/⌘+V）',
    upTitle:'上传外观 QR 或粘贴网址', resultTitle:'你的身高数值',
    cur:'当前身高', tall:'最高', short:'最矮', copy:'复制结果', json:'原始数据 (JSON)',
    potion:'喝一瓶重塑药水？', drink:'喝下药水', reset:'重置', hist:'历史测量', empty:'还没有记录，先计算一次吧 ✨', clear:'清空历史', saveImg:'保存图片', lang:'EN',
    cbgLink:'藏宝阁链接（每行一个，支持批量）',
    cbgExtract:'提取并计算', cbgPaste:'一键粘贴', cbgClear:'清空', cbgSample:'填入示例',
    cbgManual:'手动输入 / 公式说明', cbgS:'体型值 S（scale）', cbgH:'身高值 H（height）', cbgManualRun:'手动计算',
    cbgSave:'保存为图片',
    cbgHint:'数据来源：<code>cbg-other-desc.res.netease.com/.../equipdesc/{商品ID}.json</code>。体型 / 身高 / 毕业季 即时读取，结果一目了然。在内置预览里跨域请求可能被拦截，此时会自动尝试代理；仍失败请右键链接「在浏览器中打开」。',
    themeDark:'切换到夜间模式', themeLight:'切换到日间模式',
    snLabel:'商品ID', via:'来源', grad:'毕业季节', wing:'检测无翼', wingN:'无翼', wingY:'有翼',
    okTag:'已提取', failTag:'提取失败', manualSn:'手动输入',
    sVal:'体型值 S', hVal:'身高值 H', curH:'当前身高', maxH:'最高身高', minH:'最矮身高', dwarfH:'矮人面具身高',
    hiInt:'整数型', loading:'正在读取体型 / 身高…', thId:'商品ID', thGrad:'毕业季节', thWing:'检测无翼',
    errNoLink:'请先粘贴至少一个藏宝阁链接', errNoResult:'没有结果', showHere:'结果将显示在这里',
    errInvalid:'请输入有效的体型值 / 身高值',
    formulaHtml:'计算公式（已用真实数据逐位校验）：<br><code>当前身高 = 7.6 − 8.3×S − 3×H</code><br><code>最高身高 = 1.6 − 8.3×S</code><br><code>最矮身高 = 13.6 − 8.3×S</code><br><code>矮人面具身高 = 16.6 − 8.3×S</code><br><br>注：部分身高计算器显示的「身高值」为 <code>round(height × 10¹⁰)</code> 的整数形式（如 19625966083）。'
  },
  en:{
    catQr:'Outfit QR', catCbg:'CBG',
    calc:'Calculate', upload:'Scan Upload', url:'Paste URL', placeholder:'Paste full URL, e.g. https://sky.thatg.co/o=...',
    drop_b:'Click or drop screenshot here', drop_s:'or paste image (Ctrl/⌘+V)',
    upTitle:'Upload Outfit QR or paste URL', resultTitle:'Your height',
    cur:'Current Height', tall:'Tallest', short:'Shortest', copy:'Copy', json:'Raw Data (JSON)',
    potion:'Drink a reshape potion?', drink:'Drink', reset:'Reset', hist:'History', empty:'No records yet. Calculate first ✨', clear:'Clear', saveImg:'Save Image', lang:'中文',
    cbgLink:'CBG links (one per line, batch supported)',
    cbgExtract:'Extract & Compute', cbgPaste:'Paste', cbgClear:'Clear', cbgSample:'Sample',
    cbgManual:'Manual input / Formula', cbgS:'Scale S', cbgH:'Height H', cbgManualRun:'Compute',
    cbgSave:'Save Image',
    cbgHint:'Data from <code>cbg-other-desc.res.netease.com/.../equipdesc/{itemID}.json</code>. Scale / height / graduation read live. Cross-origin may be blocked in in-app preview; proxies are tried, or right-click the link to open it in a browser.',
    themeDark:'Switch to dark mode', themeLight:'Switch to light mode',
    snLabel:'Item ID', via:'Source', grad:'Graduations', wing:'Wingless check', wingN:'Wingless', wingY:'Winged',
    okTag:'Extracted', failTag:'Failed', manualSn:'Manual input',
    sVal:'Scale S', hVal:'Height H', curH:'Current', maxH:'Tallest', minH:'Shortest', dwarfH:'Dwarf Mask',
    hiInt:'Integer form', loading:'Reading scale / height…', thId:'Item ID', thGrad:'Grad.', thWing:'Wingless',
    errNoLink:'Paste at least one CBG link first', errNoResult:'No results', showHere:'Results will appear here',
    errInvalid:'Enter a valid scale / height value',
    formulaHtml:'Formula (verified digit-by-digit with real data):<br><code>Current = 7.6 − 8.3×S − 3×H</code><br><code>Tallest = 1.6 − 8.3×S</code><br><code>Shortest = 13.6 − 8.3×S</code><br><code>Dwarf mask = 16.6 − 8.3×S</code><br><br>Note: some calculators display "height" as <code>round(height × 10¹⁰)</code> (e.g. 19625966083).'
  } };

function setLang(l){
  lang=l; const t=I18N[l];
  document.documentElement.lang=l==='zh'?'zh-CN':'en';
  $('langBtn').textContent=t.lang;
  /* 分类标签 */
  document.querySelectorAll('#catSeg button').forEach(b=>b.textContent = b.dataset.cat==='qr'?t.catQr:t.catCbg);
  /* QR 视图 */
  const cb=$('calcBtn'); if(cb) cb.querySelector('.ui-label').textContent=t.calc;
  $('upTitle').textContent=t.upTitle;
  $('upLabel').textContent=t.upload; $('urlLabel').textContent=t.url;
  $('urlInput').placeholder=t.placeholder;
  $('drop').querySelector('b').textContent=t.drop_b; $('drop').querySelector('span').textContent=t.drop_s;
  $('resultTitle').textContent=t.resultTitle;
  $('resCurrentLabel').textContent=t.cur;
  $('resTallestLabel').textContent=t.tall; $('resShortestLabel').textContent=t.short;
  $('saveImgBtn').textContent=t.saveImg;
  document.querySelector('#resultCard summary').textContent=t.json;
  $('potionTitle').textContent=t.potion; $('potionBtn').textContent=t.drink; $('potionReset').textContent=t.reset;
  $('histTitle').textContent=t.hist; $('histEmpty').textContent=t.empty; $('clearHist').textContent=t.clear;
  /* cbg 视图 */
  $('cbgLinkLabel').textContent=t.cbgLink;
  const rb=$('run'); if(rb) rb.querySelector('.ui-label').textContent=t.cbgExtract;
  $('paste').textContent=t.cbgPaste; $('clear').textContent=t.cbgClear; $('sample').textContent=t.cbgSample;
  $('cbgManualSum').textContent=t.cbgManual;
  $('lblManualS').textContent=t.cbgS; $('lblManualH').textContent=t.cbgH; $('manualRun').textContent=t.cbgManualRun;
  $('saveImg').textContent=t.cbgSave;
  $('cbgHint').innerHTML=t.cbgHint;
  $('cbgFormula').innerHTML=t.formulaHtml;
  /* 已有结果时按新语言重渲染 */
  if(typeof currentItems!=='undefined' && currentItems.length){ render(currentItems.slice()); }
  syncThemeBtn();
  /* 语言切换后分类按钮宽度变化，重算滑动指示器 */
  requestAnimationFrame(()=>{ if(typeof posTab==='function') posTab(); });
  /* Hero */
  renderHero();
}
$('langBtn').onclick=()=>setLang(lang==='zh'?'en':'zh');

/* ===================== 主题：View Transitions 圆形揭示 ===================== */
function syncThemeBtn(){
  const dark=document.documentElement.dataset.theme==='dark';
  $('iconSun').style.display = dark?'none':'block';
  $('iconMoon').style.display = dark?'block':'none';
  const t=I18N[lang];
  $('themeBtn').title = dark?t.themeLight:t.themeDark;
  $('themeBtn').setAttribute('aria-label', dark?t.themeLight:t.themeDark);
}
function applyTheme(t){
  document.documentElement.dataset.theme=t;
  localStorage.setItem(LS_THEME,t);
  syncThemeBtn();
}
function setTheme(t, x, y){
  if(!document.startViewTransition || REDUCE){ applyTheme(t); return; }
  const vt=document.startViewTransition(()=>applyTheme(t));
  vt.ready.then(()=>{
    const r=Math.hypot(Math.max(x,innerWidth-x), Math.max(y,innerHeight-y));
    document.documentElement.animate(
      { clipPath:[`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration:640, easing:'cubic-bezier(0.16,1,0.3,1)', pseudoElement:'::view-transition-new(root)' }
    );
  }).catch(()=>{});
}
$('themeBtn').addEventListener('click',e=>{
  const dark=document.documentElement.dataset.theme==='dark';
  const next=dark?'light':'dark';
  setTheme(next, e.clientX||innerWidth-40, e.clientY||40);
});

function renderHero(){
  const h=HERO[currentCat][lang];
  $('heroKicker').textContent=h.k;
  $('heroTitle').innerHTML=h.t;
  $('heroSub').textContent=h.s;
}
function showCat(cat){
  currentCat=cat;
  document.querySelectorAll('#catSeg button').forEach(b=>{
    b.classList.toggle('active', b.dataset.cat===cat);
    b.setAttribute('aria-selected', b.dataset.cat===cat?'true':'false');
  });
  $('view-qr').hidden  = cat!=='qr';
  $('view-cbg').hidden = cat!=='cbg';
  renderHero();
  localStorage.setItem(LS_CAT, cat);
  /* 切换视图时，让新视图内的卡片依次入场（强制重启 CSS 动画） */
  const view = cat==='qr' ? $('view-qr') : $('view-cbg');
  view.querySelectorAll('.card').forEach((el,i)=>{
    el.style.animation='none';
    void el.offsetWidth;                 /* 强制回流以重启动画 */
    el.style.animation='';
    el.style.animationDelay=(i*80)+'ms';
  });
  requestAnimationFrame(posTab);
}
document.querySelectorAll('#catSeg button').forEach(b=>b.addEventListener('click',()=>showCat(b.dataset.cat)));

/* ===================== 星尘引擎（Canvas 2D） ===================== */
(function(){
  if(REDUCE) return;                       /* RM：不启动，CSS 已隐藏画布 */
  const cv=$('dust'); if(!cv) return;
  const ctx=cv.getContext('2d');
  let W=0,H=0,DPR=1, parts=[], raf=0, running=true;
  let mx=.5,my=.5, px=0,py=0;              /* 鼠标视差（归一化 + 平滑） */
  const PALETTE={ light:[[230,181,93],[94,172,235],[47,145,226]],
                  dark:[[253,224,161],[147,197,253],[196,181,253]] };
  const count=()=>Math.max(36, Math.min(90, Math.round(innerWidth*innerHeight/16000)));
  function resize(){
    DPR=Math.min(devicePixelRatio||1,2); W=innerWidth; H=innerHeight;
    cv.width=W*DPR; cv.height=H*DPR;
    cv.style.width=W+'px'; cv.style.height=H+'px';
    ctx.setTransform(DPR,0,0,DPR,0,0);
    if(!parts.length) seed(); else while(parts.length>count()) parts.pop();
  }
  function seed(){
    parts=[]; const n=count();
    for(let i=0;i<n;i++) parts.push(mk(Math.random()*W, Math.random()*H));
  }
  function mk(x,y){
    const theme=document.documentElement.dataset.theme;
    const pal=PALETTE[theme==='dark'?'dark':'light'];
    const c=pal[Math.floor(Math.random()*pal.length)];
      return { x, y, r:.7+Math.random()*1.7,
      vy:-(.05+Math.random()*.22), ph:Math.random()*Math.PI*2,
      ds:.4+Math.random()*.9, tw:.5+Math.random()*1.4,
      a:.18+Math.random()*.32, c, burst:false, vx:0, life:1 };
  }
  function burst(sx,sy){
    const theme=document.documentElement.dataset.theme;
    const pal=PALETTE[theme==='dark'?'dark':'light'];
    for(let i=0;i<42;i++){
      const ang=Math.random()*Math.PI*2, sp=1.2+Math.random()*3.4;
      parts.push({ x:sx, y:sy, r:1+Math.random()*2,
        vy:-Math.sin(ang)*sp*.5-.3, vx:Math.cos(ang)*sp,
        ph:Math.random()*Math.PI*2, ds:.6, tw:2+Math.random()*2,
        a:.5+Math.random()*.45, c:pal[Math.floor(Math.random()*pal.length)],
        burst:true, life:1 });
    }
    if(!running){ running=true; raf=requestAnimationFrame(loop); }
  }
  window.__skyBurst=burst;
  let t=0;
  function loop(){
    if(!running) return;
    t+=.016;
    const dark=document.documentElement.dataset.theme==='dark';
    ctx.clearRect(0,0,W,H);
    px+=((mx-.5)*22-px)*.04; py+=((my-.5)*16-py)*.04;
    ctx.globalCompositeOperation=dark?'lighter':'source-over';
    for(let i=parts.length-1;i>=0;i--){
      const p=parts[i];
      if(p.burst){ p.x+=p.vx; p.y+=p.vy; p.vx*=.965; p.vy*=.965; p.life-=.014; if(p.life<=0){ parts.splice(i,1); continue; } }
      else{
        p.y+=p.vy; p.x+=Math.sin(t*p.ds+p.ph)*.18;
        if(p.y<-8){ p.y=H+8; p.x=Math.random()*W; }
        if(p.x<-8) p.x=W+8; else if(p.x>W+8) p.x=-8;
      }
      const a=p.a*(.55+.45*Math.sin(t*p.tw+p.ph))*(p.burst?p.life:1);
      const g=ctx.createRadialGradient(p.x+px*(p.burst?0:1)*.5,p.y+py*(p.burst?0:1)*.5,0,p.x+px*(p.burst?0:1)*.5,p.y+py*(p.burst?0:1)*.5,p.r*4);
      g.addColorStop(0,`rgba(${p.c[0]},${p.c[1]},${p.c[2]},${a})`);
      g.addColorStop(1,`rgba(${p.c[0]},${p.c[1]},${p.c[2]},0)`);
      ctx.fillStyle=g;
      ctx.beginPath(); ctx.arc(p.x+px*(p.burst?0:1)*.5,p.y+py*(p.burst?0:1)*.5,p.r*4,0,Math.PI*2); ctx.fill();
    }
    raf=requestAnimationFrame(loop);
  }
  addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',()=>{ running=!document.hidden; if(running) raf=requestAnimationFrame(loop); else cancelAnimationFrame(raf); });
  if(FINE) addEventListener('pointermove',e=>{ mx=e.clientX/innerWidth; my=e.clientY/innerHeight; },{passive:true});
  resize(); raf=requestAnimationFrame(loop);
})();

/* ===================== QR 工具逻辑 ===================== */
function calculateStats(height, scale){
  const current = 7.6 - 8.3*scale - 3*height;
  if(current < -1 || current > 15) return { error:'数值越界' };
  return {
    current,
    tallest: 7.6 - 8.3*scale - 3*(-2.0),
    shortest:7.6 - 8.3*scale - 3*( 2.0),
    scale, json:{ height_raw:height, scale_raw:scale }
  };
}
function decodeAndCalculate(raw){
  try{
    const m1="ImJvZHki", i1=raw.indexOf(m1);
    if(i1!==-1){
      let b=raw.substring(i1).replace(/-/g,'+').replace(/_/g,'/');
      const p=b.length%4; if(p) b+='='.repeat(4-p);
      const txt=atob(b);
      const hk=txt.match(/eigh/i); if(!hk) return {error:'解析失败'};
      const hm=txt.substring(hk.index).match(/(-?\d*\.\d+|-?\d+\.?\d*)/);
      if(!hm) return {error:'解析失败'};
      const h=parseFloat(hm[1]);
      const sk=txt.match(/scale/i); if(!sk) return {error:'解析失败'};
      const sub=txt.substring(sk.index+sk[0].length);
      const np=/(-?\d+\.?\d*(?:[eE][-+]?\d+)?)/g; let m,s;
      while((m=np.exec(sub))!==null){ const v=parseFloat(m[1]);
        if(m[1].includes('.')||m[1].toLowerCase().includes('e')){s=v;break;}
        else if(Math.abs(v)>=1000){s=v/1e9;break;} }
      if(s===undefined) return {error:'解析失败'};
      return calculateStats(h,s);
    }
    let b=raw; const oi=b.indexOf("o="); if(oi!==-1) b=b.substring(oi+2);
    b=b.replace(/-/g,'+').replace(/_/g,'/');
    const p=b.length%4; if(p) b+='='.repeat(4-p);
    let txt; try{ txt=atob(b); }catch(e){ return {error:'Base64 解码失败'}; }
    let height=null,scale=null;
    const sa=txt.match(/["']s/i);
    if(sa){ const ai=sa.index; const af=txt.substring(ai+sa[0].length);
      const cands=af.match(/(-?\d+\.?\d*(?:[eE][-+]?\d+)?)/g)||[];
      for(const c of cands){ const v=parseFloat(c);
        if(c.includes('.')||c.toLowerCase().includes('e')){scale=v;break;}
        else if(Math.abs(v)>=1000){scale=v/1e9;break;} }
      const bf=txt.substring(0,ai);
      const fm=[...bf.matchAll(/(-?\d+\.\d+(?:[eE][-+]?\d+)?)/g)];
      if(fm.length) height=parseFloat(fm[fm.length-1][1]);
      else{ const am=[...bf.matchAll(/(-?\d+(?:\.\d+)?)/g)]; if(am.length) height=parseFloat(am[am.length-1][1]); }
    }
    if(scale===null){ const sm=txt.match(/["']?s["']?\s*:/i);
      if(sm){ const sub=txt.substring(sm.index+sm[0].length); const mm=sub.match(/[^\d-]*(-?\d+\.?\d*(?:[eE][-+]?\d+)?)/);
        if(mm){ let v=parseFloat(mm[1]); scale=Math.abs(v)>=1000?v/1e9:v; } } }
    if(height===null){ const hm=txt.match(/["']?h["']?\s*:/i);
      if(hm){ const sub=txt.substring(hm.index+hm[0].length); const mm=sub.match(/[^\d-]*(-?\d+\.?\d*(?:[eE][-+]?\d+)?)/);
        if(mm) height=parseFloat(mm[1]); } else { const sm=txt.match(/^(-?\d+\.?\d*(?:[eE][-+]?\d+)?)/); if(sm) height=parseFloat(sm[1]); } }
    if(height!==null&&scale!==null) return calculateStats(height,scale);
    if(height!==null||scale!==null) return {error:'数值越界'};
    return {error:'无法识别该数据'};
  }catch(e){ return {error:'解析异常'}; }
}

let lastResult=null, lastScale=null, hist=[];
const LS_HIST='skyHeightHist2';
function setStatus(msg,cls){ const s=$('status'); s.textContent=msg; s.className='status'+(cls?(' '+cls):''); }
function easeOutBack(p){ const c1=1.2, c3=c1+1; return 1 + c3*Math.pow(p-1,3) + c1*Math.pow(p-1,2); }
function animateValue(el,to,pop){
  const from=parseFloat(el.dataset.v||'0')||0; const dur=620, t0=performance.now();
  if(REDUCE){ el.textContent=to.toFixed(4); el.dataset.v=to; return; }
  function step(t){ const p=Math.min((t-t0)/dur,1); const e=easeOutBack(p);
    el.textContent=(from+(to-from)*e).toFixed(4);
    if(p<1) requestAnimationFrame(step); else { el.textContent=to.toFixed(4); el.dataset.v=to;
      if(pop){ el.classList.remove('pop','glow'); void el.offsetWidth; el.classList.add('glow'); } } }
  requestAnimationFrame(step);
}
function calc(){
  const raw=($('urlInput').value||'').trim();
  if(!raw){ setStatus('请先上传截图或粘贴网址','err'); return; }
  const r=decodeAndCalculate(raw);
  if(r.error){ setStatus('✗ '+r.error,'err'); $('resultCard').hidden=true; $('potionCard').hidden=true; return; }
  lastResult=r; lastScale=r.scale;
  $('resultCard').hidden=false; $('potionCard').hidden=false;
  animateValue($('resCurrent'),r.current,true);
  animateValue($('resTallest'),r.tallest,false);
  animateValue($('resShortest'),r.shortest,false);
  $('resJson').textContent=JSON.stringify(r.json,null,2);
  setStatus('✓ 计算完成','ok');
  addHist(r);
  /* 揭晓仪式：数字到达时星尘迸发 */
  if(!REDUCE && window.__skyBurst){
    setTimeout(()=>{ const el=$('resCurrent'); const rc=el.getBoundingClientRect();
      window.__skyBurst(rc.left+rc.width/2, rc.top+rc.height/2); }, 420);
  }
}
$('calcBtn').addEventListener('click',calc);
$('urlInput').addEventListener('paste',()=>setTimeout(calc,0));

/* 上传 / 拖拽 / 粘贴 */
$('drop').addEventListener('click',()=>$('fileInput').click());
$('drop').addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); $('fileInput').click(); } });
$('fileInput').onchange=e=>{ if(e.target.files[0]) handleQR(e.target.files[0]); };
['dragover','dragenter'].forEach(ev=>$('drop').addEventListener(ev,e=>{e.preventDefault();$('drop').classList.add('drag');}));
['dragleave','drop'].forEach(ev=>$('drop').addEventListener(ev,e=>{e.preventDefault();$('drop').classList.remove('drag');}));
$('drop').addEventListener('drop',e=>{ if(e.dataTransfer.files[0]) handleQR(e.dataTransfer.files[0]); });
document.addEventListener('paste',e=>{ const it=e.clipboardData&&e.clipboardData.items; if(it) for(const i of it){ if(i.type.indexOf('image')>=0){ e.preventDefault(); handleQR(i.getAsFile()); break; } } });

function loadImg(file){ return new Promise((res,rej)=>{ const r=new FileReader(); r.onload=ev=>{ const im=new Image(); im.onload=()=>res(im); im.onerror=rej; im.src=ev.target.result; }; r.onerror=rej; r.readAsDataURL(file); }); }
function pre(img,c,b){ const d=new Uint8ClampedArray(img.data); const f=(259*(c+255))/(255*(259-c)); for(let i=0;i<d.length;i+=4){ let g=0.299*d[i]+0.587*d[i+1]+0.114*d[i+2]; g=f*(g-128)+128+b; g=Math.max(0,Math.min(255,g)); d[i]=d[i+1]=d[i+2]=g; } return new ImageData(d,img.width,img.height); }
function bin(img,th){ const d=new Uint8ClampedArray(img.data); for(let i=0;i<d.length;i+=4){ let g=0.299*d[i]+0.587*d[i+1]+0.114*d[i+2]; const v=g>th?255:0; d[i]=d[i+1]=d[i+2]=v; } return new ImageData(d,img.width,img.height); }
async function handleQR(file){
  if(typeof jsQR==='undefined'){ setStatus('QR 库未加载（需联网）','err'); return; }
  setStatus('正在识别二维码…');
  try{
    const im=await loadImg(file);
    const canvas=document.createElement('canvas'); const ctx=canvas.getContext('2d',{willReadFrequently:true});
    let code=null;
    for(const sc of [1,0.5,0.25,0.75,1.5]){
      canvas.width=im.width*sc; canvas.height=im.height*sc; ctx.drawImage(im,0,0,canvas.width,canvas.height);
      const od=ctx.getImageData(0,0,canvas.width,canvas.height);
      for(const proc of [x=>x, x=>pre(x,50,0), x=>pre(x,100,20), x=>pre(x,80,-20), x=>bin(x,128), x=>bin(x,100), x=>bin(x,150)]){
        const pd=proc(od);
        code=jsQR(pd.data,pd.width,pd.height,{inversionAttempts:'attemptBoth'}); if(code&&code.data) break;
      }
      if(code&&code.data) break;
    }
    if(code&&code.data){ $('urlInput').value=code.data; setStatus('识别成功，已填入网址'); setTimeout(calc,120); }
    else setStatus('未识别到二维码，请尝试更清晰的截图','err');
  }catch(e){ setStatus('识别失败：'+e.message,'err'); }
}

/* 历史 */
function loadHist(){ try{ hist=JSON.parse(localStorage.getItem(LS_HIST)||'[]'); }catch(e){ hist=[]; } renderHist(); }
function addHist(r){ hist.unshift({current:r.current,tallest:r.tallest,shortest:r.shortest,ts:Date.now()}); if(hist.length>10) hist.pop(); localStorage.setItem(LS_HIST,JSON.stringify(hist)); renderHist(); }
function renderHist(){ const box=$('histList'); box.innerHTML='';
  $('histEmpty').hidden=!!hist.length; $('clearHist').hidden=!hist.length;
  hist.forEach((h,i)=>{ const li=document.createElement('div'); li.className='hist-item';
    li.innerHTML=`<span class="v">${h.current.toFixed(4)}</span><span class="t">${new Date(h.ts).toLocaleString()}</span><button class="x" data-i="${i}" aria-label="删除该条记录">×</button>`;
    box.appendChild(li); });
  box.querySelectorAll('.x').forEach(b=>b.addEventListener('click',()=>{ hist.splice(+b.dataset.i,1); localStorage.setItem(LS_HIST,JSON.stringify(hist)); renderHist(); }));
}
$('clearHist').addEventListener('click',()=>{ hist=[]; localStorage.removeItem(LS_HIST); renderHist(); });

/* 药水模拟器 */
$('potionBtn').addEventListener('click',()=>{ if(lastScale===null){ setStatus('请先计算一次','err'); return; }
  const h=Math.random()*4-2; const n=7.6-8.3*lastScale-3*h;
  const pv=$('potionResult'); const from=parseFloat(pv.dataset.v||'0')||0; const t0=performance.now();
  if(REDUCE){ pv.textContent=n.toFixed(4); pv.dataset.v=n; }
  else (function step(t){ const p=Math.min((t-t0)/360,1); const e=easeOutBack(p); pv.textContent=(from+(n-from)*e).toFixed(4); if(p<1)requestAnimationFrame(step); else { pv.textContent=n.toFixed(4); pv.dataset.v=n; } })();
  $('potionCount').textContent=(+$('potionCount').textContent+1);
  if(!REDUCE){ const v=$('potionVisual'); v.classList.remove('splash'); void v.offsetWidth; v.classList.add('splash'); }
  $('potionNote').textContent = h>=1.96?'极稀有·超高!':(h<=-1.96?'极稀有·极矮!':'');
});
$('potionReset').addEventListener('click',()=>{ $('potionResult').textContent='—'; $('potionResult').dataset.v='0'; $('potionCount').textContent='0'; $('potionNote').textContent=''; });

/* 保存身高数值结果图片 */
function roundRect(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
function saveResultImage(){
  if(!lastResult){ setStatus('请先计算一次','err'); return; }
  const W=1080,H=1080, c=document.createElement('canvas'); c.width=W; c.height=H;
  const ctx=c.getContext('2d');
  const g=ctx.createLinearGradient(0,0,W,H); g.addColorStop(0,'#f4f8fc'); g.addColorStop(1,'#e9f2fb');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  /* 星尘点缀 */
  for(let i=0;i<70;i++){ const x=Math.random()*W, y=Math.random()*H, r=.8+Math.random()*2.4;
    ctx.fillStyle=`rgba(94,172,235,${.06+Math.random()*.14})`;
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); }
  const px=70, py=210, pw=W-140, ph=H-420;
  roundRect(ctx,px,py,pw,ph,44);
  ctx.fillStyle='rgba(255,255,255,0.72)'; ctx.fill();
  ctx.lineWidth=2; ctx.strokeStyle='rgba(255,255,255,0.9)'; ctx.stroke();
  ctx.save(); ctx.clip(); ctx.fillStyle='rgba(94,172,235,0.06)'; ctx.fillRect(px,py,pw,ph*0.42); ctx.restore();
  const cx=W/2, fam='"Space Grotesk", -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif';
  ctx.textAlign='center';
  ctx.fillStyle='#4a6284'; ctx.font='600 34px '+fam; ctx.fillText(lang==='en'?'CURRENT HEIGHT':'当前身高',cx,py+96);
  ctx.fillStyle='#1c3c63'; ctx.font='700 182px '+fam; ctx.fillText(lastResult.current.toFixed(4),cx,py+280);
  ctx.fillStyle='#4a6284'; ctx.font='500 34px '+fam;
  ctx.fillText((lang==='en'?'Tallest ':'最高  ')+lastResult.tallest.toFixed(4),cx,py+392);
  ctx.fillText((lang==='en'?'Shortest ':'最矮  ')+lastResult.shortest.toFixed(4),cx,py+456);
  ctx.fillStyle='rgba(60,84,116,0.72)'; ctx.font='400 24px '+fam;
  ctx.fillText('Sky 身高仪 · Sky Height Tool',cx,H-56);
  const a=document.createElement('a'); a.download='sky-height-'+Date.now()+'.png'; a.href=c.toDataURL('image/png'); a.click();
  setStatus('✓ 已保存图片','ok');
}
$('saveImgBtn').addEventListener('click',saveResultImage);

/* ===================== 藏宝阁（CBG）逻辑 ===================== */
const DESC_BASE = "https://cbg-other-desc.res.netease.com/sky/static/equipdesc/";
const PROXIES = [
  u => "https://api.allorigins.win/raw?url=" + encodeURIComponent(u),
  u => "https://corsproxy.io/?url=" + encodeURIComponent(u),
  u => "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent(u),
  u => "https://thingproxy.freeboard.io/fetch/" + u,
  u => "https://cors.eu.org/" + u
];
const out = $('out');
const saveBtn = $('saveImg');
let currentItems = [];
function showResultBar(){ if(saveBtn) saveBtn.hidden = false; }

function parseOrdersn(link){
  link = (link||'').trim();
  const m = link.match(/\/equip\/\d+\/([0-9a-fA-F-]{8,})/);
  if(m) return m[1].trim();
  return null;
}
function extract(json){
  const ed = JSON.parse(json.equip_desc);
  const rc = ed.raw_content || ed;
  const eo = rc.equipped_outfit;
  if(!eo) throw new Error('该数据未包含角色外观(equipped_outfit)');
  if(typeof eo.scale !== 'number' || typeof eo.height !== 'number')
    throw new Error('未找到体型值/身高值字段');
  let gradCount = null;
  if(typeof rc.season_graduation_count === 'number') gradCount = rc.season_graduation_count;
  else if(Array.isArray(rc.season_graduation)) gradCount = rc.season_graduation.length;
  let isWingless = null;
  if(typeof rc.is_wingless === 'boolean') isWingless = rc.is_wingless;
  return { scale: eo.scale, height: eo.height, gradCount, isWingless };
}
function compute(S,H){
  return { cur: 7.6 - 8.3*S - 3*H, max: 1.6 - 8.3*S, min: 13.6 - 8.3*S, dwarf: 16.6 - 8.3*S };
}
const r4 = x => (Math.round(x*10000)/10000).toFixed(4);
const precise = x => { let s = Number(x).toFixed(10); return s.replace(/0+$/,'').replace(/\.$/,''); };

function cardHTML(item){
  const t = I18N[lang];
  if(item.error){
    return `<div class="card">
      <div class="top">
        <span class="sn">${escapeHtml(item.link||item.sn||'')}</span>
        <span class="status err">${t.failTag}</span>
      </div>
      <div class="err-msg">${escapeHtml(item.error)}</div>
    </div>`;
  }
  const {sn,S,H,heights,hiInt,via,gradCount,isWingless} = item;
  const row = (k,v,cls,sub,ind)=>`<div class="metric ${cls||''}"><div class="k">${ind?`<span class="dot-ind ${ind}"></span>`:''}${k}</div><div class="right"><div class="v">${v}</div>${sub?`<div class="sub">${sub}</div>`:''}</div></div>`;
  const meta = [];
  if(gradCount!=null) meta.push(`${t.grad} ${gradCount}`);
  const snItems = [`<span class="sn-item sn-id-item"><span class="sn-label">${t.snLabel}</span><code>${escapeHtml(sn)}</code></span>`];
  if(via) snItems.push(`<span class="sn-item">${t.via}: ${escapeHtml(via)}</span>`);
  meta.forEach(m => snItems.push(`<span class="sn-item">${escapeHtml(m)}</span>`));
  const snHtml = snItems.join('<span class="sn-sep">·</span>');
  return `<div class="card">
    <div class="top">
      <span class="sn">${snHtml}</span>
      <span class="status ok">${t.okTag}</span>
    </div>
    <div class="metrics">
      ${item.isWingless===true?row(t.wing,t.wingN,'wing-no'):item.isWingless===false?row(t.wing,t.wingY,'wing-yes'):row(t.wing,'—')}
      ${S!=null?row(t.sVal, precise(S)):row(t.sVal,'—')}
      ${H!=null?row(t.hVal, precise(H), '', t.hiInt + ' ' + hiInt):row(t.hVal,'—')}
      ${heights?row(t.curH, r4(heights.cur)):''}
      ${heights?row(t.maxH, r4(heights.max), 'max', '', 'max'):''}
      ${heights?row(t.minH, r4(heights.min), 'min', '', 'min'):''}
      ${heights?row(t.dwarfH, r4(heights.dwarf), 'dwarf'):''}
    </div>
  </div>`;
}
function escapeHtml(s){return (s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

async function fetchEquip(sn){
  const target = DESC_BASE + sn + '.json';
  const attempts = [{name:'直连', url: target}].concat(
    PROXIES.map((p,i)=>({name:'代理'+(i+1), url: p(target)}))
  );
  let lastErr = null;
  for(const a of attempts){
    try{
      const res = await fetch(a.url, {headers:{'Accept':'application/json'}});
      if(!res.ok) throw new Error('HTTP '+res.status);
      const json = await res.json();
      return {json, via: a.name};
    }catch(e){ lastErr = e; }
  }
  throw new Error((lastErr && lastErr.message) || '网络请求失败');
}
async function processBase(link){
  const sn = parseOrdersn(link);
  if(!sn) return {link, error:'无法从链接解析出商品ID（确认是 sky.cbg.163.com 的 equip 链接）'};
  try{
    const {json, via} = await fetchEquip(sn);
    const {scale,height,gradCount,isWingless} = extract(json);
    const heights = compute(scale,height);
    return {sn, S:scale, H:height, heights, hiInt:Math.round(height*1e10), via, gradCount, isWingless};
  }catch(e){
    const tip = (e.message||'').includes('Failed to fetch')
      ? '（多半是 App 内置预览面板拦截了跨域请求——请在该链接上右键「在浏览器中打开」）'
      : '';
    return {link, sn, error: (e.message||String(e)) + tip};
  }
}
async function run(){
  const t = I18N[lang];
  const links = $('links').value.split('\n').map(s=>s.trim()).filter(Boolean);
  if(!links.length){ out.innerHTML=`<div class="empty">${t.errNoLink}</div>`; return; }
  currentItems = [];
  const multi = links.length > 1;
  if(multi){
    out.innerHTML = `<div class="card"><table><thead><tr>
      <th>${t.thId}</th><th>${t.sVal}</th><th>${t.hVal}</th><th>${t.curH}</th><th>${t.maxH}</th><th>${t.minH}</th><th>${t.thGrad}</th><th>${t.thWing}</th>
    </tr></thead><tbody id="tbody"></tbody></table></div>`;
  } else {
    out.innerHTML = `<div class="loading"><div class="spinner"></div>${t.loading}</div>`;
  }
  const tbody = multi ? $('tbody') : null;
  for(let i=0;i<links.length;i++){
    const item = await processBase(links[i]);
    item._i = i;
    currentItems.push(item);
    if(multi){ tbody.insertAdjacentHTML('beforeend', rowHTML(item, i)); }
    else { out.innerHTML = cardHTML(item); if(!item.error && window.__skyBurst && !REDUCE){ const rc=out.getBoundingClientRect(); window.__skyBurst(rc.left+rc.width/2, rc.top+60); } }
  }
  showResultBar();
}
function manualRun(){
  const t = I18N[lang];
  const S = parseFloat($('manualS').value);
  const H = parseFloat($('manualH').value);
  if(!isFinite(S)||!isFinite(H)){ out.innerHTML=`<div class="empty">${t.errInvalid}</div>`; return; }
  const heights = compute(S,H);
  render([{sn:t.manualSn, S, H, heights, hiInt:Math.round(H*1e10)}], true);
}
function rowHTML(item, i){
  if(item.error){
    return `<tr><td colspan="8" style="color:var(--danger)">${escapeHtml(item.link||item.sn||'')} — ${escapeHtml(item.error)}</td></tr>`;
  }
  const wingTxt = item.isWingless===true?'无翼':item.isWingless===false?'有翼':'—';
  const wingCls = item.isWingless===true?'wing-no':item.isWingless===false?'wing-yes':'';
  return `<tr>
    <td class="num"><span class="id">${escapeHtml(item.sn)}</span></td>
    <td class="num">${item.S!=null?precise(item.S):'—'}</td>
    <td class="num">${item.H!=null?precise(item.H):'—'}</td>
    <td class="num">${item.heights?r4(item.heights.cur):'—'}</td>
    <td class="num max-v">${item.heights?r4(item.heights.max):'—'}</td>
    <td class="num min-v">${item.heights?r4(item.heights.min):'—'}</td>
    <td class="num">${item.gradCount!=null?item.gradCount:'—'}</td>
    <td class="num ${wingCls}">${wingTxt}</td>
  </tr>`;
}
function render(items, single){
  const t = I18N[lang];
  if(!items.length){ out.innerHTML=`<div class="empty">${t.errNoResult}</div>`; return; }
  if(items.length===1){
    items[0]._i = 0;
    out.innerHTML = cardHTML(items[0]);
    showResultBar();
    return;
  }
  items.forEach((it,i)=>{ it._i = i; });
  const rows = items.map(it=>rowHTML(it, it._i)).join('');
  out.innerHTML = `<div class="card"><table>
    <thead><tr><th>${t.thId}</th><th>${t.sVal}</th><th>${t.hVal}</th><th>${t.curH}</th><th>${t.maxH}</th><th>${t.minH}</th><th>${t.thGrad}</th><th>${t.thWing}</th></tr></thead>
    <tbody>${rows}</tbody></table></div>`;
  showResultBar();
}
$('run').addEventListener('click', run);
$('clear').addEventListener('click', ()=>{ $('links').value=''; out.innerHTML=`<div class="empty">${I18N[lang].showHere}</div>`; if(saveBtn) saveBtn.hidden=true; });
$('sample').addEventListener('click', ()=>{ $('links').value='https://sky.cbg.163.com/cgi/mweb/equip/1/8ae21245-0cad-4552-a88e-414aae549e02?view_loc=my_collect'; });
$('paste').addEventListener('click', async ()=>{
  try{
    if(!(navigator.clipboard && navigator.clipboard.readText)) throw new Error('当前环境不支持剪贴板读取（需 HTTPS 或 localhost）');
    const text = await navigator.clipboard.readText();
    if(!text || !text.trim()){ alert('剪贴板为空，没有可粘贴的内容'); return; }
    const ta = $('links');
    const cur = ta.value.trim();
    ta.value = cur ? cur + '\n' + text.trim() : text.trim();
    ta.focus();
  }catch(e){ alert('无法自动读取剪贴板，请手动粘贴（Ctrl/⌘ + V）。\n原因：' + (e && e.message ? e.message : e)); }
});
$('manualRun').addEventListener('click', manualRun);
$('saveImg').addEventListener('click', async function(){
  if(typeof html2canvas === 'undefined'){ alert('图片生成库未加载（可能处于离线环境），请联网后重试。'); return; }
  const node = out;
  const prevPad = node.style.padding, prevBg = node.style.background;
  node.style.padding = '20px';
  node.style.background = '#ffffff';
  const oldText = this.textContent;
  this.textContent = '生成中…'; this.disabled = true;
  try{
    if(document.fonts && document.fonts.ready) await document.fonts.ready;
    const canvas = await html2canvas(node, {backgroundColor:'#ffffff', scale: Math.max(2, window.devicePixelRatio||1), useCORS:true, logging:false});
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'sky身高结果_' + Date.now() + '.png';
    document.body.appendChild(a); a.click(); a.remove();
  }catch(e){ alert('生成图片失败：' + (e && e.message ? e.message : e)); }
  finally{ node.style.padding = prevPad; node.style.background = prevBg; this.textContent = oldText; this.disabled = false; }
});

/* ===================== 玻璃增强交互（指针精细设备） ===================== */
if(!REDUCE && FINE){
  document.querySelectorAll('.card').forEach(c=>{
    c.addEventListener('pointermove',e=>{ const r=c.getBoundingClientRect();
      c.style.setProperty('--px',((e.clientX-r.left)/r.width*100)+'%');
      c.style.setProperty('--py',((e.clientY-r.top)/r.height*100)+'%'); },{passive:true});
  });
  document.querySelectorAll('.btn, .icon-btn').forEach(b=>{
    b.addEventListener('pointermove',e=>{ const r=b.getBoundingClientRect();
      b.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
      b.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%'); },{passive:true});
  });
  /* 分类按钮磁吸 */
  document.querySelectorAll('.cat-seg button').forEach(b=>{
    b.addEventListener('pointermove',e=>{
      const r = b.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      b.style.transform = 'translate(' + (mx * 0.25) + 'px,' + (my * 0.35) + 'px)';
    });
    b.addEventListener('pointerleave', function(){ b.style.transform = ''; });
  });
}

/* ===================== Tabs 滑动指示 ===================== */
const seg = document.getElementById('catSeg');
let posTab = function(){};
if(seg){
  const ind = seg.querySelector('.cat-ind');
  const btns = Array.prototype.slice.call(seg.querySelectorAll('button'));
  posTab = function(){
    const active = seg.querySelector('button.active') || btns[0];
    if(!active || !ind) return;
    ind.style.width = active.offsetWidth + 'px';
    ind.style.transform = 'translateX(' + (active.offsetLeft - 4) + 'px)';
  };
  addEventListener('resize', posTab, {passive:true});
  if(document.fonts && document.fonts.ready){ document.fonts.ready.then(posTab); }
  setTimeout(posTab, 80);
  posTab();
}

/* Border Beam：结果卡出现时点亮旋转光束 */
(function(){
  const card = document.getElementById('resultCard');
  if(!card || REDUCE) return;
  const sync = function(){ card.classList.toggle('on', !card.hidden); };
  if(typeof MutationObserver !== 'undefined'){
    new MutationObserver(sync).observe(card, { attributes:true, attributeFilter:['hidden'] });
  }
  sync();
})();

/* ===================== 顶栏：滚动缩小 → 隐藏（iOS 风格，带滞回） ===================== */
(function(){
  const bar = document.querySelector('.topbar');
  if(!bar) return;

  const SHRINK_AT = 16;    /* 离开顶部多少距离进入「缩小」态 */
  const HIDE_AT   = 160;   /* 下滑超过该位置才允许收起 */
  const HYST      = 48;    /* 滞回：换向后需累计行进这么多像素才真正翻转状态 */
  const TOP_ZONE  = 24;    /* 回到这个区间视为"在顶部"，强制展开并恢复原尺寸 */

  let anchorY   = window.scrollY || 0;  /* 上一次状态翻转时的锚点位置 */
  let hidden    = false;
  let shrunk    = false;
  let ticking   = false;
  let animTimer = null;
  let scrollTimer = null;

  /* 动画期间才提升合成层；动画结束后释放，避免长期占用显存 */
  function markAnimating(){
    bar.classList.add('is-animating');
    clearTimeout(animTimer);
    animTimer = setTimeout(()=>bar.classList.remove('is-animating'), 620);
  }

  /* 滚动期间把玻璃模糊降级为实色：blur 每帧都要重新采样背景，是掉帧主因。
     停止滚动后延迟恢复，避免恢复瞬间又触发一次重绘。 */
  function markScrolling(){
    if(!bar.classList.contains('is-scrolling')) bar.classList.add('is-scrolling');
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(()=>bar.classList.remove('is-scrolling'), 140);
  }

  function apply(){
    ticking = false;
    const y = Math.max(0, window.scrollY || 0);

    /* ---- 缩小态：单纯跟随位置，带一点滞回避免边界抖动 ---- */
    const wantShrunk = shrunk ? y > SHRINK_AT * 0.5 : y > SHRINK_AT;
    if(wantShrunk !== shrunk){
      shrunk = wantShrunk;
      bar.classList.toggle('is-shrunk', shrunk);
      markAnimating();
    }

    /* ---- 收起态：只在"相对锚点"累计行进足够距离后才翻转 ---- */
    if(y <= TOP_ZONE){
      /* 顶部区域：无条件展开 */
      if(hidden){ hidden = false; bar.classList.remove('is-hidden'); markAnimating(); }
      anchorY = y;
      return;
    }

    const traveledUp   = anchorY - y;   /* >0 表示相对锚点向上行进 */
    const traveledDown = y - anchorY;   /* >0 表示相对锚点向下行进 */

    if(!hidden){
      /* 当前展开：需要向下累计走够 HYST，且位置超过 HIDE_AT，才收起 */
      if(traveledDown > HYST && y > HIDE_AT){
        hidden = true; bar.classList.add('is-hidden'); anchorY = y; markAnimating();
      }
    } else {
      /* 当前收起：只要向上累计走够 HYST 就展开（比收起更灵敏，符合 iOS 手感） */
      if(traveledUp > HYST){
        hidden = false; bar.classList.remove('is-hidden'); anchorY = y; markAnimating();
      }
    }
  }

  function onScroll(){
    markScrolling();
    if(!ticking){ ticking = true; requestAnimationFrame(apply); }
  }

  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll, {passive:true});
  apply();
})();

/* ===================== init ===================== */
out.innerHTML='<div class="empty">'+I18N[lang].showHere+'</div>';
const initTheme = localStorage.getItem(LS_THEME)||'light';
document.documentElement.dataset.theme=initTheme;
const initLang = localStorage.getItem(LS_LANG)||'zh';
const initCat = localStorage.getItem(LS_CAT)||'qr';
setLang(initLang);
loadHist();
showCat(initCat);
