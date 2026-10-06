import {Suspense,useEffect,useState} from 'react';
import {Link,NavLink,Outlet,useLocation} from 'react-router-dom';
import {AnimatePresence,motion} from 'framer-motion';
import {Languages,Lock,Menu,X} from 'lucide-react';
import {useLang} from '../i18n/index.jsx';
import {NAV,PUBLIC,sec} from '../data/sections.js';
const MAIN=[{to:'/',hi:'मुखपृष्ठ',en:'Home'},{to:'/about',hi:'परिचय',en:'About'},...NAV.map(k=>({to:'/'+k,hi:sec(k).hi,en:sec(k).en})),{to:'/map',hi:'नक्शा',en:'Map'},{to:'/contact',hi:'संपर्क',en:'Contact'}];
const MORE=PUBLIC.filter(s=>!NAV.includes(s.k)).map(s=>({to:'/'+s.k,hi:s.hi,en:s.en}));
export function Logo({size=40}){return(
<svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Belanagar emblem"><defs><clipPath id="bnc"><circle cx="32" cy="32" r="31"/></clipPath></defs>
<g clipPath="url(#bnc)"><rect width="64" height="64" fill="#1f4d2b"/><path d="M17 44a15 15 0 0 1 30 0z" fill="#e8891c"/>
<path d="M32 15v5M18 21l3.5 3.5M46 21l-3.5 3.5M8 32l5 1.5M56 32l-5 1.5" stroke="#e8891c" strokeWidth="2.4" strokeLinecap="round"/>
<path d="M9 44l6-6 6 6zM43 44l7-7 7 7z" fill="#faf4e6"/><rect y="44" width="64" height="20" fill="#6b4a2e"/>
<path d="M0 50h64M0 55h64M0 60h64" stroke="#e8891c" strokeWidth="1.2" opacity=".55"/></g></svg>)}
function Navbar(){
 const {lang,toggle,pick}=useLang();const [open,setOpen]=useState(false),[small,setSmall]=useState(false),loc=useLocation();
 useEffect(()=>{const f=()=>setSmall(window.scrollY>40);f();window.addEventListener('scroll',f,{passive:true});return()=>window.removeEventListener('scroll',f)},[]);
 useEffect(()=>{setOpen(false)},[loc.pathname]);
 const cls=({isActive})=>'rounded-md px-2.5 py-1.5 text-sm font-medium '+(isActive?'bg-saffron text-ink':'text-cream/90 hover:bg-white/10');
 return(<>
 <header className={'sticky top-0 z-30 bg-leaf text-cream transition-all '+(small?'py-1.5 shadow-lg':'py-3')}>
  <div className="mx-auto flex max-w-7xl items-center gap-3 px-4">
   <Link to="/" className="mr-auto flex items-center gap-2"><Logo size={small?32:40}/><span className="font-display text-xl tracking-wide">BELANAGAR</span></Link>
   <nav aria-label="Main" className="hidden items-center gap-0.5 xl:flex">{MAIN.map(l=><NavLink key={l.to} to={l.to} end className={cls}>{pick(l)}</NavLink>)}</nav>
   <button onClick={toggle} aria-label="Switch language" className="flex min-h-11 items-center gap-1 rounded-md border border-cream/40 px-3 text-sm"><Languages size={16}/>{lang==='hi'?'English':'हिंदी'}</button>
   <Link to="/admin" className="btn btn-saffron hidden text-sm sm:inline-flex"><Lock size={16}/>Admin</Link>
   <button className="grid min-h-11 min-w-11 place-items-center xl:hidden" aria-label="Open menu" aria-expanded={open} onClick={()=>setOpen(true)}><Menu/></button>
  </div>
 </header>
 <AnimatePresence>{open&&<>
  <motion.div className="fixed inset-0 z-40 bg-black/50" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setOpen(false)}/>
  <motion.aside role="dialog" aria-label="Menu" className="fixed bottom-0 right-0 top-0 z-50 w-72 max-w-[85vw] overflow-y-auto bg-leaf p-4 text-cream" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'tween',duration:.25}}>
   <button className="ml-auto grid min-h-11 min-w-11 place-items-center" aria-label="Close menu" onClick={()=>setOpen(false)}><X/></button>
   <nav aria-label="Menu"><ul>{[...MAIN,...MORE].map(l=><li key={l.to}><NavLink to={l.to} end className={({isActive})=>'block border-b border-white/10 px-2 py-3 '+(isActive?'text-saffron':'')}>{pick(l)}</NavLink></li>)}
   <li><Link to="/admin" className="block px-2 py-3">Admin</Link></li></ul></nav>
  </motion.aside></>}</AnimatePresence></>)}
function Footer(){const {t,pick}=useLang();
 return(<footer className="mt-16 bg-ink text-cream/90"><div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-2">
  <div><div className="flex items-center gap-2"><Logo/><b className="font-display text-xl">BELANAGAR</b></div><p className="mt-2 font-display">{t('tagline')}</p><p className="mt-4 text-sm">{t('built')}</p></div>
  <nav aria-label="Footer"><ul className="grid grid-cols-2 gap-1 text-sm">{[...MAIN,...MORE].map(l=><li key={l.to}><Link className="inline-block py-1 hover:underline" to={l.to}>{pick(l)}</Link></li>)}</ul></nav></div></footer>)}
export default function Layout(){const loc=useLocation();
 return(<><Navbar/><motion.main key={loc.pathname} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.2}} className="min-h-[70vh]">
  <Suspense fallback={<p role="status" className="py-12 text-center">…</p>}><Outlet/></Suspense></motion.main><Footer/></>)}
