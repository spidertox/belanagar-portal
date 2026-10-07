import {lazy,Suspense} from 'react';
import {Link} from 'react-router-dom';
import {useData} from '../lib/api.js';
import {useLang} from '../i18n/index.jsx';
import {sec} from '../data/sections.js';
import {useAllPlaces} from '../lib/places.js';
import {HeroArt} from '../components/Art.jsx';
import {ItemCard,Reveal,SectionTitle,Status,usePageTitle} from '../components/UI.jsx';
const VillageMap=lazy(()=>import('../components/VillageMap.jsx'));
const today=()=>new Date().toISOString().slice(0,10);
const byDate=(a,b)=>(a.date||'').localeCompare(b.date||'');
const BLOCKS=[['announcements',d=>d],['events',d=>d.filter(e=>!e.date||e.date>=today()).sort(byDate)],['news',d=>[...d].sort((a,b)=>byDate(b,a))],['festivals',d=>d]];
function Block({k,sel}){const {t,pick}=useLang();const {data,loading,error}=useData(k,[]);const list=sel(data).slice(0,3);
 return(<section className="mx-auto max-w-7xl px-4 py-10"><Reveal><div className="mb-6 flex items-end justify-between gap-4"><h2 className="font-display text-3xl text-leaf sm:text-4xl">{pick(sec(k))}</h2><Link className="inline-flex min-h-11 items-center font-medium text-soil underline" to={'/'+k}>{t('viewAll')}</Link></div></Reveal>
 <Status loading={loading} error={error} empty={!list.length}><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((i,n)=><Reveal key={i.id} d={n*.08} className="h-full"><ItemCard it={i} k={k}/></Reveal>)}</div></Status></section>)}
export default function Home(){const {t,lab}=useLang();usePageTitle('');
 const {data}=useData('summary',{village:{},counts:{}});const v=data.village||{},c=data.counts||{};
 const {items,pinned,loading,error}=useAllPlaces();
 const stats=[['population',v.population,'👥'],['households',v.households,'🏠'],['schools',c.schools,'🏫'],['places',c.places,'📍'],['festivals',c.festivals,'🪔'],['businesses',c.businesses,'🏪']];
 const facts=['panchayat','block','district','state','elevation'].filter(k=>v[k]);
 const where=[v.district,v.state].filter(Boolean).join(', ');
 return(<>
 <section className="relative overflow-hidden bg-leaf text-cream"><div className="pattern absolute inset-0"/>
  <div className="relative z-10 mx-auto max-w-7xl px-4 pb-44 pt-14 sm:pb-52 md:pt-20 lg:pb-64">
   {where&&<p className="inline-block rounded-full border border-cream/30 bg-white/10 px-4 py-1 text-sm backdrop-blur">📍 {where}</p>}
   <h1 className="mt-4 font-display text-5xl tracking-wide sm:text-7xl lg:text-8xl">BELANAGAR</h1>
   <p className="mt-2 font-display text-2xl text-saffron sm:text-3xl">{t('tagline')}</p>
   <p className="mt-2 max-w-xl text-cream/85">{t('heroSub')}</p>
   <div className="mt-7 flex flex-wrap gap-3"><Link to="/about" className="btn btn-saffron">{t('explore')}</Link><Link to="/map" className="btn btn-ghost">{t('map')}</Link></div></div>
  <HeroArt className="absolute inset-x-0 bottom-0 h-[230px] w-full sm:h-[330px] lg:h-[500px]"/></section>
 <section aria-label="Village statistics" className="relative z-20 mx-auto -mt-10 max-w-7xl px-4"><Reveal>
  <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-soil/15 shadow-xl sm:grid-cols-3 lg:grid-cols-6">
  {stats.map(([k,val,e])=><div key={k} className="flex flex-col-reverse items-center bg-white p-4 text-center"><dt className="text-sm text-soil">{t(k)}</dt><dd className="font-display text-2xl text-leaf">{val||<span className="font-sans text-xs text-soil/80">{t('soon')}</span>}</dd><span aria-hidden="true" className="text-xl">{e}</span></div>)}</dl></Reveal></section>
 <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[1.2fr_1fr] lg:items-center">
  <Reveal><SectionTitle left title={t('about')}/><p className="font-display text-xl leading-relaxed text-ink/90 sm:text-2xl">{v.intro}</p><Link to="/about" className="btn btn-saffron mt-6">{t('knowVillage')}</Link></Reveal>
  <Reveal d={.1}><div className="card p-6"><h3 className="font-display text-xl text-leaf">{t('facts')}</h3>
   <dl className="mt-3 divide-y divide-soil/15">{facts.map(k=><div key={k} className="flex justify-between gap-4 py-2"><dt className="text-soil">{lab(k)}</dt><dd className="text-right font-medium">{v[k]}</dd></div>)}</dl></div></Reveal></section>
 <section className="bg-leaf/5 py-14"><div className="mx-auto max-w-7xl px-4"><Reveal><SectionTitle title={t('map')} sub={t('mapSub')}/></Reveal>
  <Suspense fallback={<div className="h-[380px] animate-pulse rounded-2xl bg-soil/10 lg:h-[520px]"/>}><VillageMap points={pinned} className="h-[380px] lg:h-[520px]"/></Suspense>
  <div className="mt-6 text-center"><Link to="/map" className="btn btn-saffron">{t('openMap')}</Link></div></div></section>
 <section className="mx-auto max-w-7xl px-4 py-14"><Reveal><SectionTitle title={t('placesTitle')}/></Reveal>
  <Status loading={loading} error={error} empty={!items.length}><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.slice(0,6).map((i,n)=><Reveal key={i.id} d={(n%3)*.08} className="h-full"><ItemCard it={i} k="places"/></Reveal>)}</div>
  <div className="mt-8 text-center"><Link to="/places" className="btn border border-soil/40 bg-white">{t('viewAll')}</Link></div></Status></section>
 {BLOCKS.map(([k,sel])=><Block key={k} k={k} sel={sel}/>)}
 <section className="relative mt-10 overflow-hidden bg-leaf text-cream"><div className="pattern absolute inset-0"/>
  <Reveal className="relative mx-auto max-w-3xl px-4 py-14 text-center"><h2 className="font-display text-3xl sm:text-4xl">{t('help')}</h2><p className="mx-auto mt-3 max-w-xl text-cream/85">{t('helpSub')}</p><Link to="/contact" className="btn btn-saffron mt-6">{t('contribute')}</Link></Reveal></section></>)}
