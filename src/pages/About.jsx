import {Link} from 'react-router-dom';
import {useData} from '../lib/api.js';
import {useLang} from '../i18n/index.jsx';
import Census from '../components/Census.jsx';
import {PageHead,Reveal,SectionTitle,Status,Zoomable} from '../components/UI.jsx';
const INFO=['panchayat','block','district','state','country','elevation','languages','timezone','pin'];
const SOURCES=['Census of India 2011 — District Census Handbook, Supaul (Directorate of Census Operations, Bihar)','हिंदी विकिपीडिया — बेलानगर / Hindi Wikipedia — Belanagar','Google Maps listings (admin-provided links)','Village boundary & Rajdhani area: admin-provided KML · Map data © OpenStreetMap contributors'];
export default function About(){const {t,lab}=useLang();const {data:v,loading,error}=useData('village',{});
 const ll=v.lat!=null&&v.lng!=null&&v.lat!==''&&v.lng!=='';
 const fmt=(a,b)=>`${Math.abs(a)}°${a>=0?'N':'S'}, ${Math.abs(b)}°${b>=0?'E':'W'}`;
 return(<><PageHead title={t('about')} sub={v.intro}/>
 <div className="mx-auto max-w-7xl space-y-16 px-4 py-12">
 <Status loading={loading} error={error} empty={!Object.keys(v).length}><>
  <section><Reveal><SectionTitle left title={t('basic')}/></Reveal>
   <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {INFO.map(k=><div key={k} className="card p-4"><dt className="text-sm text-soil">{lab(k)}</dt><dd className="mt-1 font-display text-xl text-leaf">{v[k]||<span className="font-sans text-base text-ink/60">{t('na')}</span>}</dd></div>)}
    {ll&&<div className="card p-4"><dt className="text-sm text-soil">{lab('coordinates')}</dt><dd className="mt-1 font-display text-xl text-leaf">{fmt(+v.lat,+v.lng)}</dd></div>}</dl></section>
  <section className="grid items-center gap-8 lg:grid-cols-[360px_1fr]">
   <Reveal><figure className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-soil/20 bg-white shadow-lg"><Zoomable src="/images/belanagar-satellite.jpg" alt={t('satCap')} fit="contain" className="aspect-[11/20] bg-ink/5"/><figcaption className="p-3 text-sm text-ink/80">{t('satCap')}</figcaption></figure></Reveal>
   <Reveal d={.1}><SectionTitle left title={t('satTitle')}/><p className="max-w-xl text-lg text-ink/85">{t('satText')}</p><Link to="/map" className="btn btn-saffron mt-5">{t('openMap')}</Link></Reveal></section>
  <section><Reveal><SectionTitle left title={t('censusTitle')} sub={t('censusSub')}/></Reveal><Census/></section>
  <section><Reveal><SectionTitle left title={t('sourcesTitle')}/></Reveal><ul className="list-disc space-y-1 pl-5 text-ink/85">{SOURCES.map(s=><li key={s}>{s}</li>)}</ul>{v.last_updated&&<p className="mt-3 text-sm text-ink/70">{t('updated')}: {v.last_updated}</p>}</section></></Status></div></>)}
