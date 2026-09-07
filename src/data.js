/* ===== Data layer. Source of truth: data/*.json in the repo. A copy is inlined at build time (__INLINE) so the page also works offline / from file://. ===== */
const FORMAT_KEYS={short:{kitsKey:"fmt_short_kits",timeKey:"fmt_short_time",nameKey:"fmt_short"},sat:{kitsKey:"fmt_sat_kits",timeKey:"fmt_sat_time",nameKey:"fmt_sat"},long:{kitsKey:"fmt_long_kits",timeKey:"fmt_long_time",nameKey:"fmt_long"}};
async function fetchJSON(path){
  if(location.protocol==="file:") throw new Error("file");
  const r=await fetch(path+"?t="+Math.floor(Date.now()/60000),{cache:"no-store"}); if(!r.ok) throw new Error(r.status); return r.json();
}
async function loadData(opts={}){
  const D={};
  try{ [D.kits,D.sessions,D.settings]=await Promise.all([fetchJSON("data/kits.json"),fetchJSON("data/sessions.json"),fetchJSON("data/settings.json")]); D.live=true; }
  catch(e){ D.kits=__INLINE.kits; D.sessions=__INLINE.sessions; D.settings=__INLINE.settings; D.live=false; }
  if(opts.guide){ try{ D.guide=await fetchJSON("data/guides/"+opts.guide+".json"); }catch(e){ D.guide=(__INLINE.guides||{})[opts.guide]||null; } }
  return D;
}
/* expose the globals the pages use */
function applyData(D){
  window.KITS=D.kits.filter(k=>k.active!==false);
  window.DATES=D.sessions.filter(s=>s.status!=="done"&&s.date>=new Date().toISOString().slice(0,10)).sort((a,b)=>a.date<b.date?-1:1).map(s=>({iso:s.date,format:s.format,kits:s.kits,seats:s.status==="full"?0:s.seats}));
  window.FORMATS={}; for(const f in FORMAT_KEYS) FORMATS[f]=Object.assign({},FORMAT_KEYS[f],D.settings.formats[f]);
  window.CONTACT_EMAIL=D.settings.email; window.KIT_PRICE=D.settings.kitPrice; window.PHOTOS=D.settings.photos||[]; window.FEATURED=D.settings.featured||[];
}
