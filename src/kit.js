/* ===== Kit page: catalogue info is public, the step guide unlocks after a (simulated) purchase. ===== */
(async function(){
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const LOCALE={de:"de-CH",en:"en-GB",fr:"fr-CH",it:"it-CH",ca:"ca-ES",es:"es-ES"};
  const STEPBG=["#F6DDD7","#F7E6A8","#DCE7D8","#DDE5EF","#F5E4DA","#E8E1F0"];
  let lang=DEFAULT_LANG;
  const t=(k,vars)=>{let s=(I18N[lang]&&I18N[lang][k])??I18N[DEFAULT_LANG][k]??k; if(vars) for(const v in vars) s=s.replace(`{${v}}`,vars[v]); return s;};
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  function detectLang(){try{const s=localStorage.getItem("stich-lang"); if(s&&LANGS.includes(s)) return s;}catch(e){} const nav=(navigator.languages||[navigator.language||""]).map(l=>l.slice(0,2).toLowerCase()); return nav.find(l=>LANGS.includes(l))||DEFAULT_LANG;}
  const id=new URLSearchParams(location.search).get("id");
  const __D=await loadData({guide:id}); applyData(__D);
  const kit=KITS.find(k=>k.id===id)||KITS[0];
  const guide=__D.guide;
  const dk=k=>k+"_"+((guide&&guide.defaults)||"default");
  const owned=()=>{try{return JSON.parse(localStorage.getItem("stich-owned")||"[]").includes(kit.id);}catch(e){return false;}};
  const setOwned=v=>{try{let a=JSON.parse(localStorage.getItem("stich-owned")||"[]"); a=a.filter(x=>x!==kit.id); if(v)a.push(kit.id); localStorage.setItem("stich-owned",JSON.stringify(a));}catch(e){}};
  const fmtDuration=h=>{const hh=Math.floor(h),mm=Math.round((h-hh)*60);return mm?`${hh}${t("dur_h")} ${mm}${t("dur_min")}`:`${hh}${t("dur_h")}`;};
  const photo=()=>PHOTOS.includes("kits/"+kit.id)?`<img class="real" src="img/kits/${kit.id}.jpg" alt="">`:"";
  const mailto=()=>`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t("mail_subject"))}&body=${encodeURIComponent(t("mail_body").replace(/(Projekt|Project|Projet|Progetto|Projecte|Proyecto)(\s?):\s?/,`$1$2: ${kit.name[lang]}`))}`;

  function render(){
    const f=FORMATS[kit.format], G=guide&&guide.L[lang], has=!!guide, isOwned=owned();
    const materials=has?`<section class="kit__mats"><p class="eyebrow eyebrow--dash" data-i18n="kit_in">${t("kit_in")}</p><div class="mats">${G.materials.map((m,i)=>`<div class="mat"><span class="mat__sw" style="background:${STEPBG[i%STEPBG.length]}"></span><b>${esc(m[0])}</b><span>${esc(m[1])}</span></div>`).join("")}</div></section>`:"";
    const lock=has?(isOwned?`<div class="kit__owned"><b>${t("kit_owned")}</b><span>${t("kit_owned_p")}</span><button class="link link--ink" type="button" id="reset">${t("kit_reset")}</button></div>`
      :`<div class="kit__lock"><div><p class="eyebrow">${t("kit_steps")}</p><h2>${t("kit_lock_t")}</h2><p>${t("kit_lock_p")}</p></div><div class="kit__buybox"><button class="btn" type="button" id="buy">${t("kit_buy",{p:KIT_PRICE})}</button><small>${t("kit_buy_note")}</small></div></div>`)
      :`<div class="kit__lock kit__lock--soon"><div><p class="eyebrow">${t("kit_steps")}</p><h2>${t("kit_soon")}</h2></div></div>`;
    const steps=(has&&isOwned)?`<section class="kit__guide" id="guide">
      <div class="sec-head"><h2 class="sec-title"><span>${t("kit_steps")}</span><span class="star">✳</span></h2><nav class="toc">${G.steps.map((s,i)=>`<a href="#pas${i+1}">${String(i+1).padStart(2,"0")}</a>`).join("")}</nav></div>
      ${guide.legend?`<div class="glegend"><span class="gl gl--sew">${t("legend_sew")}</span><span class="gl gl--cut">${t("legend_cut")}</span><span class="gl gl--fold">${t("legend_fold")}</span><span class="gl gl--face">${t("legend_face")}</span><p>${t("legend_note")}</p></div>`:""}
      <div class="steps-list">${G.steps.map((s,i)=>{const n=guide.imgs[i]; return `<article class="gstep reveal" id="pas${i+1}">
        <div class="gstep__copy"><div class="gstep__num" style="background:${STEPBG[i%STEPBG.length]}">${String(i+1).padStart(2,"0")}</div><p class="eyebrow">${esc(s.e||t("kit_step",{n:i+1}))}</p><h3>${esc(s.t)}</h3>
          <ol class="gsub">${s.items.map(it=>Array.isArray(it)?`<li><b>${esc(it[0])}</b>${esc(it[1])}</li>`:`<li>${esc(it)}</li>`).join("")}</ol>
          ${s.op?`<div class="gops"><span class="gop gop--sew">${t("op_sew_"+s.op[0])}</span><span class="gop gop--cut">${t("op_cut_"+s.op[1])}</span></div>`:""}
          ${s.tip?`<div class="gtip"><b>${t("kit_tip")}</b>${esc(s.tip)}</div>`:""}${s.warn?`<div class="gtip gtip--warn"><b>${t("kit_warn")}</b>${esc(s.warn)}</div>`:""}
          <div class="gcheck"><b>${t("kit_check")}</b>${esc(s.check||t(dk("kit_check")))}</div></div>
        <div class="gstep__visual">${n?`<img src="img/guides/${kit.id}/${n}.jpg" alt="${esc(s.cap||"")}" loading="lazy"><span class="gcap">${esc(s.cap||t("kit_ref"))}</span>`:`<div class="gstep__ph" style="background:${SOFT[kit.accent]}"><svg viewBox="0 0 420 300"><rect x="85" y="45" width="250" height="210" rx="10" fill="#D9A38C" opacity=".75"/><g stroke="#6E5A51" stroke-width="2" stroke-dasharray="7 7"><line x1="125" y1="55" x2="125" y2="245"/><line x1="165" y1="55" x2="165" y2="245"/><line x1="205" y1="55" x2="205" y2="245"/><line x1="245" y1="55" x2="245" y2="245"/><line x1="285" y1="55" x2="285" y2="245"/></g></svg></div>`}</div>
      </article>`;}).join("")}</div>
      ${guide.src?`<div class="kit__source"><b>${t("kit_source")}</b> ${esc(guide.src[0])} · <a href="${esc(guide.src[1])}" target="_blank" rel="noopener">${esc(guide.src[1].replace(/^https?:\/\//,"").split("/")[0])}</a><p>${t("kit_source_note")}</p></div>`:""}
      <div class="kit__made"><p class="eyebrow">${guide.badge}</p><h2>${t("kit_made")}</h2><p>${esc(G.outro||t(dk("kit_outro")))}</p></div>
    </section>`:"";
    $("#kit").innerHTML=`
      <section class="kit__hero wrap">
        <a class="link link--ink kit__back" href="index.html#workshops"><svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" style="transform:scaleX(-1)"><path d="M1 6h15M11 1l5 5-5 5"/></svg><span>${t("kit_back")}</span></a>
        <div class="kit__grid">
          <div class="kit__copy">
            <p class="eyebrow">${has?guide.badge:t("kit_eyebrow")} · ${t("kit_level",{n:kit.level})}</p>
            <h1>${esc(has?G.title:kit.name[lang])}</h1>
            <p class="lead">${esc(has?(G.intro||t(dk("kit_intro"))):kit.desc[lang])}</p>
            <div class="pills">${has&&G.pills&&G.pills.length?G.pills.map(p=>`<span class="pill">${esc(p)}</span>`).join(""):`<span class="pill">${t("kit_time",{h:has?guide.hours:f.hours})}</span><span class="pill">${t("level"+kit.level+"_t")}</span><span class="pill">${t(f.nameKey)} · ${fmtDuration(f.hours)}</span>`}</div>
            ${materials}
          </div>
          <div class="kit__photo accent-${kit.accent}"><div class="photo kit__img">${photo()}${iconSvg(kit)}</div><span class="card__lvl">${t("level"+kit.level)}</span></div>
        </div>
      </section>
      <section class="wrap">${lock}</section>
      <div class="wrap">${steps}</div>
      <section class="kit__book wrap"><div><p class="eyebrow">${t(f.nameKey)} · ${f.price} CHF</p><h2>${t("kit_book_t")}</h2><p class="lead">${t("kit_book_p")}</p></div><a class="btn btn--sage" href="${mailto()}">${t("kit_book")}</a></section>`;
    document.title=`STICH · ${has?G.title:kit.name[lang]}`;
    const b=$("#buy"); if(b) b.addEventListener("click",()=>{setOwned(true); render(); const g=$("#guide"); if(g) g.scrollIntoView({behavior:"smooth",block:"start"});});
    const r=$("#reset"); if(r) r.addEventListener("click",()=>{setOwned(false); render(); window.scrollTo({top:0,behavior:"smooth"});});
    $$(".reveal").forEach(el=>el.classList.add("is-in"));
  }
  function applyI18n(){document.documentElement.lang=lang; $$("[data-i18n]").forEach(el=>el.textContent=t(el.dataset.i18n)); $$("[data-i18n-aria]").forEach(el=>el.setAttribute("aria-label",t(el.dataset.i18nAria))); $("#lang").value=lang; render();}
  const sel=$("#lang"); sel.innerHTML=LANGS.map(l=>`<option value="${l}">${l.toUpperCase()}</option>`).join("");
  sel.addEventListener("change",e=>{lang=e.target.value; try{localStorage.setItem("stich-lang",lang);}catch(e){} applyI18n();});
  const header=$(".header"); const onScroll=()=>header.classList.toggle("is-stuck",window.scrollY>10); onScroll(); addEventListener("scroll",onScroll,{passive:true});
  const burger=$("#burger"), nav=$("#nav"); burger.addEventListener("click",()=>{const o=nav.classList.toggle("is-open"); burger.classList.toggle("is-open",o); burger.setAttribute("aria-expanded",String(o)); document.body.style.overflow=o?"hidden":"";});
  $("#year").textContent=new Date().getFullYear();
  lang=detectLang(); applyI18n();
})();
