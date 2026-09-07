/* ===== Admin: edits data/*.json and commits them to GitHub from the browser. Catalan only (Gemma's tool). ===== */
(function(){
  const OWNER="Gemmagf", REPO="stich-web", BRANCH="main", API="https://api.github.com";
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const L=["ca","de","en","fr","it","es"], LN={ca:"Català",de:"Deutsch",en:"English",fr:"Français",it:"Italiano",es:"Español"};
  const FMT={short:"Curt",sat:"Dissabte",long:"Llarg"}, ACC=["coral","sage","mustard","blue","pink","yellow"];
  const ICONS=["case","hen","crown","bunting","pouch","mitt","lunch","tote","apron","bucket","cube","laptop","flowers","casserole","banana","backpack"];
  const files={kits:{path:"data/kits.json"},sessions:{path:"data/sessions.json"},settings:{path:"data/settings.json"}};
  const data={}; let token="";
  try{token=localStorage.getItem("stich-gh-token")||"";}catch(e){}

  const toast=(m,ok=true)=>{const t=$("#toast"); t.textContent=m; t.className="adm__toast "+(ok?"is-ok":"is-err"); t.hidden=false; clearTimeout(toast.h); toast.h=setTimeout(()=>t.hidden=true,4000);};
  const headers=()=>Object.assign({Accept:"application/vnd.github+json"},token?{Authorization:"Bearer "+token}:{});
  const b64=s=>btoa(unescape(encodeURIComponent(s))), unb64=s=>decodeURIComponent(escape(atob(s.replace(/\n/g,""))));

  async function ghGet(path){const r=await fetch(`${API}/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`,{headers:headers(),cache:"no-store"}); if(!r.ok) throw new Error("GET "+path+" → "+r.status); return r.json();}
  async function ghPut(path,sha,content,message){const r=await fetch(`${API}/repos/${OWNER}/${REPO}/contents/${path}`,{method:"PUT",headers:Object.assign(headers(),{"Content-Type":"application/json"}),body:JSON.stringify({message,content:b64(content),sha,branch:BRANCH})}); if(!r.ok){const e=await r.json().catch(()=>({})); throw new Error("PUT "+path+" → "+r.status+" "+(e.message||""));} return r.json();}

  async function loadAll(){
    for(const k in files){const f=await ghGet(files[k].path); files[k].sha=f.sha; data[k]=JSON.parse(unb64(f.content));}
    renderSessions(); renderKits(); renderSettings();
  }
  async function connect(){
    if(!token){$("#status").textContent="Sense connectar. Sense token pots mirar, no desar."; return;}
    try{const r=await fetch(API+"/user",{headers:headers()}); if(!r.ok) throw new Error(r.status); const u=await r.json(); $("#status").textContent="Connectada com a "+u.login+" · els canvis es desen al repositori "+OWNER+"/"+REPO; $("#status").className="adm__status is-ok";}
    catch(e){$("#status").textContent="Token no vàlid ("+e.message+")"; $("#status").className="adm__status is-err";}
  }
  async function save(which){
    if(!token){toast("Cal el token de GitHub per desar.",false); return;}
    const btn=$(`[data-save="${which}"]`); btn.disabled=true;
    try{
      readForm(which);
      const content=JSON.stringify(data[which],null,1)+"\n";
      const msg={sessions:"Sessions actualitzades des de l’admin",kits:"Kits actualitzats des de l’admin",settings:"Configuració actualitzada des de l’admin"}[which];
      const r=await ghPut(files[which].path,files[which].sha,content,msg); files[which].sha=r.content.sha;
      toast("Desat. La web es publica sola en un minut.");
    }catch(e){toast("No s’ha pogut desar: "+e.message,false);}
    btn.disabled=false;
  }

  /* ---------- sessions ---------- */
  function kitOptions(sel,format){return data.kits.filter(k=>k.active!==false).map(k=>`<label class="chk ${format&&k.format!==format?"is-dim":""}"><input type="checkbox" value="${k.id}" ${sel.includes(k.id)?"checked":""}> ${esc(k.name.ca)}</label>`).join("");}
  function renderSessions(){
    const list=data.sessions.slice().sort((a,b)=>a.date<b.date?-1:1);
    $("#sessions-list").innerHTML=list.map((s,i)=>`<article class="row" data-id="${esc(s.id)}">
      <div class="row__grid">
        <label>Data<input type="date" name="date" value="${esc(s.date)}"></label>
        <label>Format<select name="format">${Object.keys(FMT).map(f=>`<option value="${f}" ${s.format===f?"selected":""}>${FMT[f]}</option>`).join("")}</select></label>
        <label>Capacitat<input type="number" name="capacity" min="1" max="12" value="${s.capacity||6}"></label>
        <label>Places lliures<input type="number" name="seats" min="0" max="12" value="${s.seats}"></label>
        <label>Estat<select name="status">${[["open","Oberta"],["full","Completa"],["done","Feta"]].map(([v,t])=>`<option value="${v}" ${s.status===v?"selected":""}>${t}</option>`).join("")}</select></label>
        <label class="row__wide">Nota (interna)<input type="text" name="note" value="${esc(s.note||"")}" placeholder="p. ex. reservat: Anna, Marta"></label>
      </div>
      <div class="row__kits"><span class="adm__label">Kits d’aquest dia</span><div class="chks">${kitOptions(s.kits||[],s.format)}</div></div>
      <div class="row__foot"><span class="adm__id">${esc(s.id)}</span><button class="link link--coral" type="button" data-del="${esc(s.id)}">Elimina</button></div>
    </article>`).join("")||`<p class="adm__hint">Cap sessió. Afegeix-ne una.</p>`;
    $$("#sessions-list [data-del]").forEach(b=>b.addEventListener("click",()=>{if(confirm("Eliminar aquesta sessió?")){readForm("sessions"); data.sessions=data.sessions.filter(s=>s.id!==b.dataset.del); renderSessions();}}));
    $$("#sessions-list select[name=format]").forEach(sel=>sel.addEventListener("change",()=>{readForm("sessions"); renderSessions();}));
  }
  function readSessions(){
    data.sessions=$$("#sessions-list .row").map(r=>({id:r.dataset.id,date:r.querySelector("[name=date]").value,format:r.querySelector("[name=format]").value,kits:$$(".chks input:checked",r).map(c=>c.value),capacity:+r.querySelector("[name=capacity]").value||6,seats:+r.querySelector("[name=seats]").value||0,status:r.querySelector("[name=status]").value,note:r.querySelector("[name=note]").value.trim()}));
  }
  $("#session-add").addEventListener("click",()=>{readForm("sessions"); const d=new Date(); d.setDate(d.getDate()+((6-d.getDay()+7)%7||7)); const iso=d.toISOString().slice(0,10); data.sessions.push({id:"s"+iso.replace(/-/g,"")+"-"+Math.random().toString(36).slice(2,5),date:iso,format:"sat",kits:[],capacity:6,seats:6,status:"open",note:""}); renderSessions();});

  /* ---------- kits ---------- */
  function renderKits(){
    $("#kits-list").innerHTML=data.kits.map(k=>`<article class="row row--kit ${k.active===false?"is-off":""}" data-id="${esc(k.id)}">
      <div class="row__grid row__grid--kit">
        <label class="row__toggle"><input type="checkbox" name="active" ${k.active!==false?"checked":""}> Actiu</label>
        <label>Núm.<input type="number" name="n" value="${k.n||""}" min="1"></label>
        <label>Format<select name="format">${Object.keys(FMT).map(f=>`<option value="${f}" ${k.format===f?"selected":""}>${FMT[f]}</option>`).join("")}</select></label>
        <label>Nivell<select name="level">${[1,2,3].map(v=>`<option value="${v}" ${k.level===v?"selected":""}>${v}</option>`).join("")}</select></label>
        <label>Color<select name="accent">${ACC.map(a=>`<option value="${a}" ${k.accent===a?"selected":""}>${a}</option>`).join("")}</select></label>
        <label>Dibuix<select name="icon">${ICONS.map(a=>`<option value="${a}" ${k.icon===a?"selected":""}>${a}</option>`).join("")}</select></label>
      </div>
      <details class="row__langs"><summary>${esc(k.name.ca||k.id)} <span class="adm__id">${esc(k.id)}</span></summary>
        <div class="langs">${L.map(l=>`<div class="lang-block"><span class="adm__label">${LN[l]}</span><input type="text" name="name-${l}" value="${esc(k.name[l]||"")}" placeholder="Nom"><textarea name="desc-${l}" rows="2" placeholder="Descripció">${esc(k.desc[l]||"")}</textarea></div>`).join("")}</div>
        <div class="row__foot"><a class="link link--sage" href="kit.html?id=${esc(k.id)}" target="_blank">Veure la pàgina ↗</a><button class="link link--coral" type="button" data-del="${esc(k.id)}">Elimina</button></div>
      </details>
    </article>`).join("");
    $$("#kits-list [data-del]").forEach(b=>b.addEventListener("click",()=>{if(confirm("Eliminar el kit "+b.dataset.del+"? Si només el vols amagar, desactiva’l.")){readForm("kits"); data.kits=data.kits.filter(k=>k.id!==b.dataset.del); renderKits();}}));
  }
  function readKits(){
    data.kits=$$("#kits-list .row").map(r=>{const g=n=>r.querySelector(`[name="${n}"]`); const name={},desc={}; L.forEach(l=>{name[l]=g("name-"+l).value.trim(); desc[l]=g("desc-"+l).value.trim();}); return {id:r.dataset.id,n:+g("n").value||0,format:g("format").value,level:+g("level").value,accent:g("accent").value,icon:g("icon").value,active:g("active").checked,name,desc};});
  }
  $("#kit-add").addEventListener("click",()=>{readForm("kits"); let id=prompt("Identificador del kit (lletres minúscules, sense espais, p. ex. cushion):"); if(!id) return; id=id.toLowerCase().replace(/[^a-z0-9]/g,""); if(!id||data.kits.some(k=>k.id===id)){toast("Identificador buit o ja existent.",false); return;} const name={},desc={}; L.forEach(l=>{name[l]="";desc[l]="";}); data.kits.push({id,n:data.kits.length+1,format:"sat",level:1,accent:"coral",icon:"tote",active:false,name,desc}); renderKits(); const el=$(`#kits-list [data-id="${id}"] details`); if(el){el.open=true; el.scrollIntoView({behavior:"smooth"});}});

  /* ---------- settings ---------- */
  function renderSettings(){
    const s=data.settings; const kitSel=(v)=>`<select>${data.kits.map(k=>`<option value="${k.id}" ${v===k.id?"selected":""}>${esc(k.name.ca)}</option>`).join("")}</select>`;
    $("#settings-form").innerHTML=`
      <label>Email de reserves<input type="email" name="email" value="${esc(s.email)}"></label>
      <label>Preu d’un kit sol (CHF)<input type="number" name="kitPrice" value="${s.kitPrice}" min="0"></label>
      <fieldset><legend>Formats</legend>${Object.keys(FMT).map(f=>`<div class="fmt-row"><b>${FMT[f]}</b><label>Preu CHF<input type="number" name="price-${f}" value="${s.formats[f].price}"></label><label>Hores<input type="number" step="0.5" name="hours-${f}" value="${s.formats[f].hours}"></label></div>`).join("")}</fieldset>
      <fieldset><legend>Els 4 tallers destacats de la portada</legend><div class="featured">${[0,1,2,3].map(i=>kitSel((s.featured||[])[i])).join("")}</div></fieldset>
      <label>Fotos disponibles (una per línia: hero, kits, espai, kits/&lt;id&gt;)<textarea name="photos" rows="4">${esc((s.photos||[]).join("\n"))}</textarea></label>`;
  }
  function readSettings(){
    const f=$("#settings-form"), g=n=>f.querySelector(`[name="${n}"]`);
    const formats={}; Object.keys(FMT).forEach(k=>formats[k]={price:+g("price-"+k).value,hours:+g("hours-"+k).value});
    data.settings={email:g("email").value.trim(),kitPrice:+g("kitPrice").value,formats,featured:$$(".featured select",f).map(s=>s.value),photos:g("photos").value.split("\n").map(x=>x.trim()).filter(Boolean)};
  }
  function readForm(w){({sessions:readSessions,kits:readKits,settings:readSettings})[w]();}

  /* ---------- wiring ---------- */
  $$(".adm__tab[data-tab]").forEach(t=>t.addEventListener("click",()=>{$$(".adm__tab").forEach(x=>x.classList.toggle("is-on",x===t)); $$(".adm__panel").forEach(p=>p.hidden=p.id!=="panel-"+t.dataset.tab);}));
  $$("[data-save]").forEach(b=>b.addEventListener("click",()=>save(b.dataset.save)));
  $("#token").value=token;
  $("#token-save").addEventListener("click",()=>{token=$("#token").value.trim(); try{localStorage.setItem("stich-gh-token",token);}catch(e){} connect();});
  window.addEventListener("beforeunload",e=>{});
  connect(); loadAll().catch(e=>toast("No s’han pogut carregar les dades: "+e.message,false));
})();
