/* ===== App ===== */
(function(){
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const SOFT={coral:"#F3CFC2",sage:"#D9E2D4",mustard:"#F5E3AE",blue:"#D6E0EA",pink:"#F6DDD6",yellow:"#FBEFC4"};
  const TONE={coral:"#CF6446",sage:"#91A58D",mustard:"#E8B846",blue:"#8FA5BD",pink:"#EBAA9E",yellow:"#F4D478"};
  const LOCALE={de:"de-CH",en:"en-GB",fr:"fr-CH",it:"it-CH",ca:"ca-ES",es:"es-ES"};

  /* --- hand-drawn-ish line-art for each kit (placeholder until photos exist) --- */
  const ICONS={
    case:`<rect x="20" y="40" width="60" height="34" rx="10"/><path d="M20 52h60" stroke-dasharray="3 3"/><circle cx="70" cy="47" r="2"/>`,
    hen:`<path d="M30 70c-8-10-4-30 12-32 10-1 16 6 20 12l14 2-8 6c2 10-6 16-18 16H34"/><circle cx="46" cy="46" r="1.5"/><path d="M40 34c2-6 8-6 8 0M46 34c2-6 8-6 8 0" /><path d="M40 70l-2 8M52 70l2 8"/>`,
    crown:`<path d="M22 72V40l14 12 14-20 14 20 14-12v32z"/><path d="M22 64h56" stroke-dasharray="3 3"/><circle cx="50" cy="32" r="2.5"/>`,
    bunting:`<path d="M10 30c20 14 60 14 80 0"/><path d="M22 36l7 16 7-14M43 40l7 16 7-14M64 38l7 14 7-16" /><text x="26" y="47" font-size="7" font-family="sans-serif" stroke="none" fill="currentColor">a</text>`,
    pouch:`<path d="M24 46c0-4 4-6 26-6s26 2 26 6v22c0 4-4 6-26 6s-26-2-26-6z"/><path d="M24 46h52" /><path d="M34 40c0-10 8-16 16-16s16 6 16 16" stroke-dasharray="3 3"/><circle cx="66" cy="34" r="2"/>`,
    mitt:`<path d="M36 76V46a12 12 0 0 1 24 0v8h6a6 6 0 0 1 0 12h-6v10z"/><path d="M36 66h24" stroke-dasharray="3 3"/><path d="M42 52v14" stroke-dasharray="2 3"/>`,
    lunch:`<path d="M28 44h44v32H28z"/><path d="M28 44l6-14h32l6 14"/><path d="M40 30v-6h20v6"/><path d="M28 60h44" stroke-dasharray="3 3"/>`,
    tote:`<path d="M26 44h48l-4 34H30z"/><path d="M38 44c0-16 24-16 24 0"/><path d="M40 60h20" stroke-dasharray="3 3"/><circle cx="50" cy="68" r="1.5"/>`,
    apron:`<path d="M36 28h28v14l10 6v30H26V48l10-6z"/><path d="M36 28c-6-6-8-6-10-2M64 28c6-6 8-6 10-2"/><path d="M38 60h10v10H38zM52 60h10v10H52z"/>`,
    bucket:`<path d="M30 48c0-6 8-8 20-8s20 2 20 8l-3 30H33z"/><path d="M30 48c6 4 34 4 40 0"/><path d="M42 36c4-8 12-8 16 0" stroke-dasharray="3 3"/><circle cx="50" cy="42" r="1.5"/>`,
    cube:`<path d="M24 40l26-12 26 12-26 12z"/><path d="M24 40v26l26 12 26-12V40"/><path d="M50 52v26"/><path d="M30 44l16 8M34 48l12 6M38 52l8 4" stroke-dasharray="1 3"/>`,
    laptop:`<rect x="22" y="34" width="56" height="40" rx="6"/><path d="M22 46h56"/><path d="M38 34c0-6 24-6 24 0" stroke-dasharray="3 3"/><rect x="42" y="56" width="16" height="8" rx="2"/>`,
    flowers:`<path d="M34 76V50h32v26z"/><path d="M42 50c-4-10 0-20 8-24 8 4 12 14 8 24"/><circle cx="50" cy="26" r="6"/><circle cx="38" cy="32" r="4"/><circle cx="62" cy="32" r="4"/><path d="M34 62h32" stroke-dasharray="3 3"/>`,
    casserole:`<rect x="22" y="46" width="56" height="26" rx="6"/><path d="M22 58h56" stroke-dasharray="3 3"/><path d="M36 46c0-16 28-16 28 0"/><path d="M30 46h40"/><circle cx="50" cy="32" r="2"/>`,
    banana:`<path d="M24 60c0-14 12-24 26-24s26 10 26 24-12 18-26 18-26-4-26-18z"/><path d="M24 56c8-6 44-6 52 0" stroke-dasharray="3 3"/><path d="M30 44c-4-14 6-24 20-30" /><path d="M70 44c4-14-6-24-20-30" />`,
    backpack:`<path d="M30 40c0-12 8-18 20-18s20 6 20 18v34H30z"/><path d="M40 22c0-6 4-8 10-8s10 2 10 8"/><rect x="38" y="52" width="24" height="16" rx="4"/><path d="M30 46h40" stroke-dasharray="3 3"/><path d="M34 74v-8M66 74v-8"/>`,
  };
  const iconSvg=(k)=>`<svg class="ph" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice"><rect width="100" height="100" fill="${SOFT[k.accent]}"/><circle cx="72" cy="28" r="22" fill="${TONE[k.accent]}" opacity=".45"/><g fill="none" stroke="#25271F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 6)">${ICONS[k.icon]}</g><path d="M10 92c20-6 60-6 80 0" fill="none" stroke="#25271F" stroke-width="1.2" stroke-dasharray="2 4" opacity=".5"/></svg>`;
  const ICO_CLOCK=`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`;
  const ICO_TAG=`<svg viewBox="0 0 24 24"><path d="M4 4h8l8 8-8 8-8-8z"/><circle cx="8" cy="8" r="1.5"/></svg>`;
  const ICO_CAL=`<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>`;
  const ARROW=`<svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M1 6h15M11 1l5 5-5 5"/></svg>`;

  /* --- language --- */
  let lang=DEFAULT_LANG;
  const t=(k,vars)=>{let s=(I18N[lang]&&I18N[lang][k])??I18N[DEFAULT_LANG][k]??k; if(vars) for(const v in vars) s=s.replace(`{${v}}`,vars[v]); return s;};
  function detectLang(){
    try{const s=localStorage.getItem("stich-lang"); if(s&&LANGS.includes(s)) return s;}catch(e){}
    const nav=(navigator.languages||[navigator.language||""]).map(l=>l.slice(0,2).toLowerCase());
    return nav.find(l=>LANGS.includes(l))||DEFAULT_LANG;
  }
  function fmtDuration(h){const hh=Math.floor(h), mm=Math.round((h-hh)*60); return mm?`${hh}${t("dur_h")} ${mm}${t("dur_min")}`:`${hh}${t("dur_h")}`;}
  function fmtDate(iso,opts){return new Intl.DateTimeFormat(LOCALE[lang]||lang,opts).format(new Date(iso+"T12:00:00"));}
  const nextDateFor=(id)=>DATES.find(d=>d.kits.includes(id)&&d.seats>0);
  function mailto(kit,date){
    let body=t("mail_body");
    if(date) body=body.replace(/(Samstag|Saturday|Samedi|Sabato|Dissabte|Sábado)(\s?):\s?/,`$1$2: ${fmtDate(date.iso,{day:"numeric",month:"long",year:"numeric"})}`);
    if(kit) body=body.replace(/(Projekt|Project|Projet|Progetto|Projecte|Proyecto)(\s?):\s?/,`$1$2: ${kit.name[lang]}`);
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t("mail_subject"))}&body=${encodeURIComponent(body)}`;
  }

  function applyI18n(){
    document.documentElement.lang=lang;
    $$("[data-i18n]").forEach(el=>el.textContent=t(el.dataset.i18n));
    $$("[data-i18n-html]").forEach(el=>el.innerHTML=t(el.dataset.i18nHtml));
    $$("[data-i18n-aria]").forEach(el=>el.setAttribute("aria-label",t(el.dataset.i18nAria)));
    const m=$("#mail"); m.textContent=CONTACT_EMAIL; m.href=mailto();
    $("#lang").value=lang;
    renderGrid(); renderDates();
  }
  function setLang(l){lang=LANGS.includes(l)?l:DEFAULT_LANG; try{localStorage.setItem("stich-lang",lang);}catch(e){} applyI18n();}

  /* --- catalogue --- */
  const filter={format:"all",level:"all"};
  function renderGrid(){
    const grid=$("#grid"); const shown=KITS.filter(k=>(filter.format==="all"||k.format===filter.format)&&(filter.level==="all"||String(k.level)===filter.level));
    grid.innerHTML=shown.map(k=>{
      const f=FORMATS[k.format], d=nextDateFor(k.id);
      const dateHtml=d?`<div class="card__date">${ICO_CAL}<span>${fmtDate(d.iso,{weekday:"long",day:"numeric",month:"long"})} · ${t(f.timeKey).split("·")[1].trim()}</span></div>`
                      :`<div class="card__date card__date--none">${ICO_CAL}<span>${t("card_nodate")}</span></div>`;
      return `<article class="card accent-${k.accent} reveal" data-id="${k.id}">
        <div class="card__img">${iconSvg(k)}<span class="card__lvl">${t("level"+k.level)}</span></div>
        <div class="card__body">
          <h3 class="card__title">${k.name[lang]}</h3>
          <div style="font-size:13px;color:var(--faint)">${t("level"+k.level+"_t")} · ${t(f.nameKey)}</div>
          <p class="card__desc">${k.desc[lang]}</p>
          <div class="card__meta"><span>${ICO_CLOCK}${fmtDuration(f.hours)}</span><span>${ICO_TAG}${f.price} CHF</span></div>
          ${dateHtml}
          <a class="link link--${k.accent} card__cta" href="${mailto(k,d)}"><span>${t("card_cta")}</span>${ARROW}</a>
        </div></article>`;
    }).join("")||`<div class="empty">${t("empty")}</div>`;
    $("#count").textContent=t("count_of",{n:shown.length,t:KITS.length});
    observeReveal(grid);
  }
  function setChip(group,v){filter[group==="f-format"?"format":"level"]=v; $$("#"+group+" .chip").forEach(c=>c.setAttribute("aria-pressed",String(c.dataset.v===v))); renderGrid();}
  $$("#f-format .chip, #f-level .chip").forEach(c=>c.addEventListener("click",()=>setChip(c.closest(".filters__group").id,c.dataset.v)));
  $$("[data-filter-format]").forEach(a=>a.addEventListener("click",()=>setChip("f-format",a.dataset.filterFormat)));

  /* --- dates --- */
  function renderDates(){
    $("#dates-list").innerHTML=DATES.map(d=>{
      const f=FORMATS[d.format], full=d.seats<=0;
      const dots=Array.from({length:6},(_,i)=>`<i class="${i<6-d.seats?"taken":""}"></i>`).join("");
      return `<div class="date ${full?"is-full":""}">
        <div class="date__day">${fmtDate(d.iso,{day:"numeric",month:"short"})}<small>${fmtDate(d.iso,{weekday:"long"})} · ${fmtDate(d.iso,{year:"numeric"})}</small></div>
        <div class="date__fmt"><b>${t(f.nameKey)} · ${f.price} CHF</b><span>${t(f.timeKey)}</span></div>
        <div class="date__kits">${d.kits.map(id=>{const k=KITS.find(x=>x.id===id);return `<span>${k.name[lang]}</span>`;}).join("")}</div>
        <div class="date__seats"><div class="seats">${dots}</div><span>${full?t("dates_full"):t("dates_seats",{n:d.seats})}</span>${full?"":`<a class="link" href="${mailto(null,d)}"><span>${t("card_cta")}</span>${ARROW}</a>`}</div>
      </div>`;}).join("");
  }

  /* --- header / nav / theme --- */
  const header=$(".header"); const onScroll=()=>header.classList.toggle("is-stuck",window.scrollY>10); onScroll(); addEventListener("scroll",onScroll,{passive:true});
  const burger=$("#burger"), nav=$("#nav");
  burger.addEventListener("click",()=>{const o=nav.classList.toggle("is-open"); burger.classList.toggle("is-open",o); burger.setAttribute("aria-expanded",String(o)); document.body.style.overflow=o?"hidden":"";});
  $$("#nav a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("is-open");burger.classList.remove("is-open");burger.setAttribute("aria-expanded","false");document.body.style.overflow="";}));
  const sections=$$("main section[id]");
  const navObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)$$("#nav a").forEach(a=>a.classList.toggle("is-active",a.getAttribute("href")==="#"+e.target.id));}),{rootMargin:"-40% 0px -55% 0px"});
  sections.forEach(s=>navObs.observe(s));
  const root=document.documentElement;
  try{const th=localStorage.getItem("stich-theme"); if(th) root.dataset.theme=th;}catch(e){}
  $("#theme").addEventListener("click",()=>{const dark=root.dataset.theme==="dark"||(!root.dataset.theme&&matchMedia("(prefers-color-scheme: dark)").matches); root.dataset.theme=dark?"light":"dark"; try{localStorage.setItem("stich-theme",root.dataset.theme);}catch(e){}});

  /* --- reveal + parallax --- */
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const show=el=>{el.classList.remove("pre");el.classList.add("is-in");};
  const revObs=("IntersectionObserver" in window)?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){show(e.target);revObs.unobserve(e.target);}}),{threshold:.05}):null;
  function observeReveal(root){
    $$(".reveal, .draw",root).forEach(el=>{
      if(el.classList.contains("is-in")||el.classList.contains("pre")) return;
      const r=el.getBoundingClientRect();
      if(reduce||!revObs||r.top<innerHeight+40){show(el);return;}   /* visible now: never hide it */
      el.classList.add("pre"); revObs.observe(el);
    });
  }
  observeReveal(document);
  /* belt and braces: anything still hidden that is on screen gets shown on scroll/resize */
  const sweep=()=>$$(".pre").forEach(el=>{const r=el.getBoundingClientRect(); if(r.top<innerHeight+40&&r.bottom>-40) show(el);});
  addEventListener("scroll",sweep,{passive:true}); addEventListener("resize",sweep); setTimeout(sweep,400);
  if(!reduce){const par=$$("[data-parallax] .ph"); const tick=()=>{const vh=innerHeight; par.forEach(p=>{const r=p.parentElement.getBoundingClientRect(); const c=(r.top+r.height/2-vh/2)/vh; p.style.transform=`translateY(${(-c*16).toFixed(1)}px) scale(1.08)`;});}; addEventListener("scroll",()=>requestAnimationFrame(tick),{passive:true}); tick();}

  /* --- init --- */
  const sel=$("#lang"); sel.innerHTML=LANGS.map(l=>`<option value="${l}">${l.toUpperCase()}</option>`).join("");
  sel.addEventListener("change",e=>setLang(e.target.value));
  $("#year").textContent=new Date().getFullYear();
  lang=detectLang(); applyI18n();
})();
