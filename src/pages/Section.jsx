import {useMemo,useState} from 'react';
import {useData} from '../lib/api.js';
import {useLang} from '../i18n/index.jsx';
import {sec} from '../data/sections.js';
import {CAT} from '../data/categories.js';
import {ItemCard,PageHead,Reveal,Status} from '../components/UI.jsx';
const today=()=>new Date().toISOString().slice(0,10);
export default function Section({k}){const {t,pick,lang}=useLang();const {data,loading,error}=useData(k,[]);const [q,setQ]=useState(''),[cat,setCat]=useState('');
 const cats=useMemo(()=>[...new Set(data.map(i=>i.category).filter(Boolean))],[data]);
 const items=data.filter(i=>(!cat||i.category===cat)&&(!q||JSON.stringify(i).toLowerCase().includes(q.toLowerCase()))).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
 const chip=on=>'btn border '+(on?'btn-saffron border-saffron':'border-soil/40 bg-white');
 const grid=l=><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{l.map((i,n)=><Reveal key={i.id} d={(n%3)*.06} className="h-full"><ItemCard it={i} k={k}/></Reveal>)}</div>;
 const up=k==='events'?items.filter(e=>!e.date||e.date>=today()).reverse():[],past=k==='events'?items.filter(e=>e.date&&e.date<today()):[];
 return(<><PageHead title={pick(sec(k))}/><div className="mx-auto max-w-7xl px-4 py-8">
 {k==='emergency'&&<a href="tel:112" className="btn btn-saffron mb-6">112 — {t('emergency112')}</a>}
 <div className="mb-6 flex flex-wrap items-center gap-3">
  <input aria-label={t('search')} placeholder={t('search')} value={q} onChange={e=>setQ(e.target.value)} className="block w-full max-w-sm rounded-lg border border-soil/30 bg-white px-4 py-3"/>
  {cats.length>1&&<div className="flex flex-wrap gap-2" role="group" aria-label="Filter"><button aria-pressed={!cat} className={chip(!cat)} onClick={()=>setCat('')}>{t('all')}</button>{cats.map(c=><button key={c} aria-pressed={cat===c} className={chip(cat===c)} onClick={()=>setCat(c)}>{CAT[c]?CAT[c].e+' '+CAT[c][lang]:c}</button>)}</div>}</div>
 <Status loading={loading} error={error} empty={!items.length}>
  {k==='events'?<>{up.length>0&&<><h2 className="mb-4 font-display text-2xl text-leaf">{t('upcoming')}</h2>{grid(up)}</>}{past.length>0&&<><h2 className="mb-4 mt-10 font-display text-2xl text-leaf">{t('past')}</h2>{grid(past)}</>}</>:grid(items)}</Status></div></>)}
