import {Link} from 'react-router-dom';
import {useData} from '../lib/api.js';
import {useLang} from '../i18n/index.jsx';
import {sec} from '../data/sections.js';
import {ItemCard,Status,usePageTitle} from '../components/UI.jsx';
const today=()=>new Date().toISOString().slice(0,10);
const byDate=(a,b)=>(a.date||'').localeCompare(b.date||'');
const BLOCKS=[['announcements',d=>d],['events',d=>d.filter(e=>!e.date||e.date>=today()).sort(byDate)],['news',d=>[...d].sort((a,b)=>byDate(b,a))]];
function Block({k,sel}){const {t,pick}=useLang();const {data,loading,error}=useData(k,[]);const list=sel(data).slice(0,3);
 return(<section className="mx-auto max-w-7xl px-4 py-8"><div className="mb-4 flex items-end justify-between"><h2 className="font-display text-3xl text-leaf">{pick(sec(k))}</h2><Link className="inline-flex min-h-11 items-center text-soil underline" to={'/'+k}>{t('viewAll')}</Link></div>
 <Status loading={loading} error={error} empty={!list.length}><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map(i=><ItemCard key={i.id} it={i}/>)}</div></Status></section>)}
export default function Home(){const {t}=useLang();usePageTitle('');
 const {data}=useData('summary',{village:{},counts:{}});const v=data.village||{},c=data.counts||{};
 const stats=[['population',v.population],['households',v.households],['schools',c.schools],['places',c.places],['festivals',c.festivals],['businesses',c.businesses]];
 return(<>
 <section className="relative overflow-hidden bg-gradient-to-b from-leaf via-leaf2 to-saffron text-cream">
  <div aria-hidden="true" className="rise absolute -right-12 bottom-10 size-72 rounded-full bg-saffron md:size-[26rem]"/>
  <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-[repeating-linear-gradient(0deg,#6b4a2e_0_10px,#583b23_10px_20px)]"/>
  <div className="relative mx-auto max-w-7xl px-4 pb-40 pt-16 md:pt-28">
   <h1 className="font-display text-6xl tracking-wide md:text-8xl">BELANAGAR</h1>
   <p className="mt-3 font-display text-2xl md:text-3xl">{t('tagline')}</p><p className="mt-2 max-w-xl">{t('heroSub')}</p>
   <div className="mt-8 flex flex-wrap gap-3"><Link to="/about" className="btn btn-saffron">{t('explore')}</Link><Link to="/map" className="btn btn-ghost">{t('map')}</Link><Link to="/contact" className="btn btn-ghost">{t('help')}</Link></div></div></section>
 <section aria-label="Village statistics" className="relative mx-auto -mt-6 max-w-7xl px-4"><dl className="grid grid-cols-2 divide-x divide-soil/15 rounded-xl border border-soil/20 bg-white shadow md:grid-cols-6">
  {stats.map(([k,val])=><div key={k} className="flex flex-col-reverse p-4 text-center"><dt className="text-sm">{t(k)}</dt><dd className="font-display text-2xl text-leaf">{val||<span className="font-sans text-sm text-soil">{t('soon')}</span>}</dd></div>)}</dl></section>
 {BLOCKS.map(([k,sel])=><Block key={k} k={k} sel={sel}/>)}</>)}
