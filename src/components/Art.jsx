export function Ornament({className='h-6 w-32'}){return(
<svg viewBox="0 0 128 24" className={className} aria-hidden="true"><g fill="#e8891c"><path d="M64 2c5 5 6 12 0 20-6-8-5-15 0-20z"/><path d="M50 8c6 0 11 4 13 13-8-1-12-6-13-13zM78 8c-6 0-11 4-13 13 8-1 12-6 13-13z" opacity=".85"/></g><path d="M4 12h36M88 12h36" stroke="#e8891c" strokeOpacity=".6" strokeWidth="1.5" strokeLinecap="round"/></svg>)}
export function HeroArt({className=''}){
 const rays=[...Array(16)].map((_,i)=>{const a=i*Math.PI/8,r=i%2?150:182;return <line key={i} x1={1010+Math.cos(a)*112} y1={300+Math.sin(a)*112} x2={1010+Math.cos(a)*r} y2={300+Math.sin(a)*r}/>});
 const mask='linear-gradient(to bottom,transparent 0,#000 28%)';
 return(
 <svg className={className} viewBox="0 0 1440 560" preserveAspectRatio="xMidYMax slice" aria-hidden="true" style={{WebkitMaskImage:mask,maskImage:mask}}>
  <defs>
   <linearGradient id="hSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1f4d2b"/><stop offset=".35" stopColor="#3b7a4b"/><stop offset=".62" stopColor="#f0a94e"/><stop offset=".8" stopColor="#fbe3b0"/></linearGradient>
   <radialGradient id="hSun"><stop offset="0" stopColor="#fff6cf"/><stop offset=".65" stopColor="#f9c25c"/><stop offset="1" stopColor="#ef8a25"/></radialGradient>
   <radialGradient id="hGlow"><stop offset="0" stopColor="#fff3c4" stopOpacity=".7"/><stop offset="1" stopColor="#fff3c4" stopOpacity="0"/></radialGradient>
   <linearGradient id="hRiver" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bfe0d8"/><stop offset="1" stopColor="#6fa9a8"/></linearGradient>
  </defs>
  <rect width="1440" height="560" fill="url(#hSky)"/>
  <circle cx="1010" cy="300" r="230" fill="url(#hGlow)"/>
  <g className="sun"><g stroke="#ffe7a3" strokeWidth="3" strokeLinecap="round" opacity=".45">{rays}</g><circle cx="1010" cy="300" r="90" fill="url(#hSun)"/></g>
  <g fill="#fff" opacity=".28" className="drift"><ellipse cx="260" cy="190" rx="90" ry="16"/><ellipse cx="320" cy="178" rx="60" ry="14"/><ellipse cx="720" cy="140" rx="110" ry="18"/></g>
  <g fill="none" stroke="#fbe3b0" strokeWidth="2.5" strokeLinecap="round" className="drift2"><path d="M420 160q6-8 12 0q6-8 12 0M456 146q5-7 10 0q5-7 10 0M486 166q5-7 10 0q5-7 10 0"/></g>
  <path d="M0 350C120 316 210 346 310 328S490 312 570 338 770 316 870 334 1110 314 1210 338 1370 322 1440 332V430H0Z" fill="#2f6b3c" opacity=".6"/>
  <path d="M0 372C100 344 190 366 290 352S470 336 550 360 760 344 880 360 1120 342 1220 364 1380 350 1440 358V440H0Z" fill="#1f4d2b" opacity=".92"/>
  <path d="M-20 404C230 384 400 430 650 410S1080 384 1460 408V446C1100 438 900 458 650 448S230 428-20 444Z" fill="url(#hRiver)"/>
  <path d="M0 418C230 400 400 442 650 424S1080 398 1440 420" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="2" strokeDasharray="36 70" className="flow"/>
  <g transform="translate(400 340)"><path d="M26 130c2-30 0-50-6-70h26c-4 20-4 42 0 70z" fill="#5a3d25"/><g fill="#1f4d2b"><circle cx="34" cy="48" r="46"/><circle cx="-6" cy="68" r="34"/><circle cx="74" cy="66" r="36"/><circle cx="34" cy="20" r="34"/></g><g fill="#2f6b3c" opacity=".7"><circle cx="20" cy="36" r="22"/><circle cx="58" cy="52" r="20"/></g><path d="M0 92v28M12 98v22M60 98v26M72 92v30" stroke="#3a2a1a" strokeWidth="2.5"/></g>
  <g transform="translate(540 402)">
   <rect y="34" width="46" height="30" fill="#ecd9b0"/><path d="M-7 36L23 8l30 28z" fill="#b4532a"/><rect x="19" y="46" width="10" height="18" fill="#6b4a2e"/>
   <rect x="62" y="40" width="38" height="24" fill="#e4cb9a"/><path d="M55 42L81 20l26 22z" fill="#8a5a33"/><rect x="76" y="50" width="9" height="14" fill="#5a3d25"/>
   <rect x="124" y="48" width="42" height="16" fill="#f6e8cc"/><path d="M130 48L136 26 145 6l9 20 6 22z" fill="#f2d9a6"/><path d="M136 26h18M133 38h24" stroke="#c9974a" strokeWidth="2"/><circle cx="145" cy="3" r="3.5" fill="#e8891c"/><path d="M145 0V-18" stroke="#6b4a2e" strokeWidth="2"/><path d="M145-18l16 5-16 5z" fill="#e8891c" className="flag"/>
   <rect x="190" y="36" width="44" height="28" fill="#efdcb4"/><path d="M183 38L212 10l29 28z" fill="#a8482a"/><rect x="206" y="46" width="10" height="18" fill="#6b4a2e"/>
   <rect x="250" y="42" width="34" height="22" fill="#e6d0a2"/><path d="M244 44L267 24l23 20z" fill="#8a5a33"/></g>
  <g transform="translate(900 412)"><rect x="10" y="20" width="5" height="44" fill="#5a3d25"/><circle cx="12" cy="18" r="22" fill="#2f6b3c"/><circle cx="34" cy="34" r="16" fill="#3b7a4b"/><circle cx="-8" cy="34" r="14" fill="#3b7a4b"/></g>
  <path d="M0 462C300 450 600 474 900 458S1300 454 1440 462V520H0Z" fill="#4b9a58"/>
  <path d="M0 492C320 480 640 506 960 488S1320 484 1440 492V548H0Z" fill="#e7b238"/>
  <path d="M0 522C340 512 700 536 1020 520S1360 516 1440 524V560H0Z" fill="#2f6b3c"/>
  <g fill="none" strokeWidth="2"><path d="M0 478C300 466 600 490 900 474S1300 470 1440 478" stroke="#1f4d2b" strokeOpacity=".25"/><path d="M0 508C320 496 640 522 960 504S1320 500 1440 508" stroke="#b8821a" strokeOpacity=".45"/></g>
  <path d="M610 560C650 520 700 500 770 492L810 492C780 510 740 530 730 560Z" fill="#c9a066" opacity=".85"/>
  <g stroke="#1f4d2b" strokeWidth="3" strokeLinecap="round" fill="none"><path d="M40 560q4-18 8-22M52 560q0-16-4-26M1380 560q-4-18-8-24M1368 560q0-16 4-26"/></g>
 </svg>)}
