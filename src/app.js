/* ===== App ===== */
(function(){
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const LOCALE={de:"de-CH",en:"en-GB",fr:"fr-CH",it:"it-CH",ca:"ca-ES",es:"es-ES"};

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
  const FEATURED=["tote","toiletry","apron","basic"];
  let showAll=false;
  const filter={format:"all",level:"all"};
  function renderGrid(){
    const grid=$("#grid"); const shown=showAll?KITS.filter(k=>(filter.format==="all"||k.format===filter.format)&&(filter.level==="all"||String(k.level)===filter.level)):FEATURED.map(id=>KITS.find(k=>k.id===id));
    $("#filters").hidden=!showAll; const tb=$("#toggle-all"); tb.setAttribute("aria-expanded",String(showAll)); tb.querySelector("span").textContent=t(showAll?"kits_less":"kits_all");
    grid.innerHTML=shown.map(k=>{
      const f=FORMATS[k.format], d=nextDateFor(k.id);
      const dateHtml=d?`<div class="card__date">${ICO_CAL}<span>${fmtDate(d.iso,{weekday:"long",day:"numeric",month:"long"})} · ${t(f.timeKey).split("·")[1].trim()}</span></div>`
                      :`<div class="card__date card__date--none">${ICO_CAL}<span>${t("card_nodate")}</span></div>`;
      return `<article class="card accent-${k.accent} reveal" data-id="${k.id}">
        <div class="card__img">${PHOTOS.includes("kits/"+k.id)?`<img class="real" src="img/kits/${k.id}.jpg" alt="${k.name[lang]}">`:""}${iconSvg(k)}<span class="card__lvl">${t("level"+k.level)}</span></div>
        <div class="card__body">
          <h3 class="card__title">${k.name[lang]}</h3>
          <p class="card__sub">${t("level"+k.level+"_t")}</p>
          <div class="card__meta"><span>${ICO_CLOCK}${fmtDuration(f.hours)}</span><span>${ICO_TAG}${f.price} CHF</span></div>
          ${dateHtml}
          <div class="card__links"><a class="link link--${k.accent} card__cta" href="${mailto(k,d)}"><span>${t("card_cta")}</span>${ARROW}</a><a class="link link--ink card__kit" href="kit.html?id=${k.id}"><span>${t("kit_view")}</span>${ARROW}</a></div>
        </div></article>`;
    }).join("")||`<div class="empty">${t("empty")}</div>`;
    $("#count").textContent=t("count_of",{n:shown.length,t:KITS.length});
    observeReveal(grid);
  }
  function setChip(group,v){filter[group==="f-format"?"format":"level"]=v; $$("#"+group+" .chip").forEach(c=>c.setAttribute("aria-pressed",String(c.dataset.v===v))); renderGrid();}
  $$("#f-format .chip, #f-level .chip").forEach(c=>c.addEventListener("click",()=>setChip(c.closest(".filters__group").id,c.dataset.v)));
  $("#toggle-all").addEventListener("click",()=>{showAll=!showAll; if(!showAll){filter.format="all";filter.level="all";$$(".filters .chip").forEach(c=>c.setAttribute("aria-pressed",String(c.dataset.v==="all")));} renderGrid();});

  /* --- dates --- */
  function renderDates(){
    $("#dates-list").innerHTML=DATES.map(d=>{
      const f=FORMATS[d.format], full=d.seats<=0;
      const dots=Array.from({length:6},(_,i)=>`<i class="${i<6-d.seats?"taken":""}"></i>`).join("");
      return `<div class="date date--${d.format} ${full?"is-full":""}">
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

  /* --- real photos over the illustrations, only when listed in PHOTOS --- */
  $$("[data-photo]").forEach(el=>{const k=el.dataset.photo; if(PHOTOS.includes(k)){const im=document.createElement("img"); im.className="real"; im.src=`img/${k}.jpg`; im.alt=""; el.prepend(im);}});

  /* --- init --- */
  const sel=$("#lang"); sel.innerHTML=LANGS.map(l=>`<option value="${l}">${l.toUpperCase()}</option>`).join("");
  sel.addEventListener("change",e=>setLang(e.target.value));
  $("#year").textContent=new Date().getFullYear();
  lang=detectLang(); applyI18n();
})();
