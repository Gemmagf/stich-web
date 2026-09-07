/* ===== Kit illustrations (shared by index and kit pages) ===== */
const SOFT={coral:"#F3CFC2",sage:"#D9E2D4",mustard:"#F5E3AE",blue:"#D6E0EA",pink:"#F6DDD6",yellow:"#FBEFC4"};
const TONE={coral:"#CF6446",sage:"#91A58D",mustard:"#E8B846",blue:"#8FA5BD",pink:"#EBAA9E",yellow:"#F4D478"};
  /* --- placeholder "photos": textile pattern ground + filled, hand-drawn object. Swap for <img> when photos exist. --- */
const PAT={
    coral:(id)=>`<pattern id="${id}" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(90)"><rect width="14" height="14" fill="#F6E6DD"/><rect width="5" height="14" fill="#EBAA9E" opacity=".55"/></pattern>`,
    sage:(id)=>`<pattern id="${id}" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#EEF2EC"/><rect width="8" height="16" fill="#91A58D" opacity=".45"/><rect width="16" height="8" fill="#91A58D" opacity=".45"/></pattern>`,
    mustard:(id)=>`<pattern id="${id}" width="18" height="18" patternUnits="userSpaceOnUse"><rect width="18" height="18" fill="#F8EFD6"/><circle cx="9" cy="9" r="2.2" fill="#E8B846"/><circle cx="0" cy="0" r="1.4" fill="#CF6446"/><circle cx="18" cy="18" r="1.4" fill="#CF6446"/></pattern>`,
    blue:(id)=>`<pattern id="${id}" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="12" height="12" fill="#E6ECF2"/><rect width="1.5" height="12" fill="#8FA5BD" opacity=".6"/></pattern>`,
    pink:(id)=>`<pattern id="${id}" width="26" height="26" patternUnits="userSpaceOnUse"><rect width="26" height="26" fill="#FBF3EE"/><circle cx="13" cy="13" r="5" fill="#EBAA9E"/><circle cx="13" cy="13" r="1.8" fill="#F4D478"/><circle cx="0" cy="0" r="2.2" fill="#91A58D"/><circle cx="26" cy="26" r="2.2" fill="#91A58D"/></pattern>`,
    yellow:(id)=>`<pattern id="${id}" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#FBF3D9"/><rect width="10" height="1.2" y="4" fill="#E8B846" opacity=".5"/></pattern>`,
  };
  /* each icon: body = closed shape (filled with the accent), lines = details */
const ICONS={
    case:{body:`<rect x="18" y="38" width="64" height="36" rx="11"/>`,lines:`<path d="M18 52h64" stroke-dasharray="3 3"/><circle cx="72" cy="46" r="2"/>`},
    hen:{body:`<path d="M28 70c-8-10-4-30 12-32 10-1 16 6 20 12l14 2-8 6c2 10-6 16-18 16H32z"/>`,lines:`<circle cx="46" cy="46" r="1.5" fill="#25271F"/><path d="M40 34c2-6 8-6 8 0M46 34c2-6 8-6 8 0"/><path d="M38 70l-2 8M52 70l2 8"/>`},
    crown:{body:`<path d="M20 74V40l15 12 15-21 15 21 15-12v34z"/>`,lines:`<path d="M20 66h60" stroke-dasharray="3 3"/><circle cx="50" cy="30" r="2.5" fill="#25271F"/>`},
    bunting:{body:`<path d="M20 34l8 18 8-16zM42 38l8 18 8-16zM64 36l8 18 8-16z"/>`,lines:`<path d="M8 28c26 14 58 14 84 0"/><text x="24" y="44" font-size="7" font-family="sans-serif" stroke="none" fill="#25271F">a</text>`},
    pouch:{body:`<path d="M22 46c0-4 4-6 28-6s28 2 28 6v22c0 4-4 6-28 6s-28-2-28-6z"/>`,lines:`<path d="M22 46h56"/><path d="M34 40c0-10 8-16 16-16s16 6 16 16" stroke-dasharray="3 3"/><circle cx="68" cy="34" r="2"/>`},
    mitt:{body:`<path d="M34 78V46a13 13 0 0 1 26 0v8h6a6 6 0 0 1 0 12h-6v12z"/>`,lines:`<path d="M34 68h26" stroke-dasharray="3 3"/><path d="M41 52v14" stroke-dasharray="2 3"/>`},
    lunch:{body:`<path d="M26 44h48v34H26z"/>`,lines:`<path d="M26 44l6-14h36l6 14"/><path d="M40 30v-6h20v6"/><path d="M26 60h48" stroke-dasharray="3 3"/>`},
    tote:{body:`<path d="M24 44h52l-4 36H28z"/>`,lines:`<path d="M37 44c0-17 26-17 26 0"/><path d="M40 62h20" stroke-dasharray="3 3"/><circle cx="50" cy="70" r="1.5" fill="#25271F"/>`},
    apron:{body:`<path d="M35 26h30v14l11 6v34H24V46l11-6z"/>`,lines:`<path d="M35 26c-6-6-8-6-10-2M65 26c6-6 8-6 10-2"/><path d="M37 60h11v11H37zM52 60h11v11H52z"/>`},
    bucket:{body:`<path d="M28 48c0-6 8-8 22-8s22 2 22 8l-3 32H31z"/>`,lines:`<path d="M28 48c6 4 38 4 44 0"/><path d="M41 36c4-8 14-8 18 0" stroke-dasharray="3 3"/><circle cx="50" cy="42" r="1.5" fill="#25271F"/>`},
    cube:{body:`<path d="M22 40l28-13 28 13v26L50 79 22 66z"/>`,lines:`<path d="M22 40l28 12 28-12M50 52v27"/><path d="M28 44l18 8M32 48l14 6" stroke-dasharray="1 3"/>`},
    laptop:{body:`<rect x="20" y="34" width="60" height="42" rx="7"/>`,lines:`<path d="M20 47h60"/><path d="M37 34c0-6 26-6 26 0" stroke-dasharray="3 3"/><rect x="41" y="57" width="18" height="9" rx="2"/>`},
    flowers:{body:`<path d="M32 78V50h36v28z"/>`,lines:`<path d="M42 50c-4-10 0-20 8-24 8 4 12 14 8 24"/><circle cx="50" cy="26" r="6" fill="#E8B846"/><circle cx="37" cy="32" r="4" fill="#EBAA9E"/><circle cx="63" cy="32" r="4" fill="#EBAA9E"/><path d="M32 63h36" stroke-dasharray="3 3"/>`},
    casserole:{body:`<rect x="20" y="46" width="60" height="28" rx="7"/>`,lines:`<path d="M20 59h60" stroke-dasharray="3 3"/><path d="M35 46c0-16 30-16 30 0"/><path d="M29 46h42"/><circle cx="50" cy="32" r="2" fill="#25271F"/>`},
    banana:{body:`<path d="M22 60c0-14 12-24 28-24s28 10 28 24-12 18-28 18-28-4-28-18z"/>`,lines:`<path d="M22 56c8-6 48-6 56 0" stroke-dasharray="3 3"/><path d="M29 44c-4-14 6-24 21-30M71 44c4-14-6-24-21-30"/>`},
    backpack:{body:`<path d="M28 40c0-12 9-19 22-19s22 7 22 19v36H28z"/>`,lines:`<path d="M40 22c0-6 4-8 10-8s10 2 10 8"/><rect x="37" y="52" width="26" height="17" rx="4" fill="#F8F4EC"/><path d="M28 46h44" stroke-dasharray="3 3"/><path d="M33 76v-8M67 76v-8"/>`},
  };
const iconSvg=(k)=>{const pid="pat-"+k.id, ic=ICONS[k.icon];
    return `<svg class="ph" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice"><defs>${PAT[k.accent](pid)}</defs><rect width="100" height="100" fill="url(#${pid})"/><ellipse cx="50" cy="86" rx="30" ry="5" fill="#25271F" opacity=".08"/><g transform="translate(0 4)" stroke="#25271F" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><g fill="${TONE[k.accent]}">${ic.body}</g><g fill="none">${ic.lines}</g></g><rect width="100" height="100" fill="transparent" filter="url(#grain)"/></svg>`;};
