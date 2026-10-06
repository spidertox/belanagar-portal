import {useState} from 'react';
import {useData} from '../lib/api.js';
import {useLang} from '../i18n/index.jsx';
import {sec} from '../data/sections.js';
import {ItemCard,PageHead,Status} from '../components/UI.jsx';
export default function Section({k}){const {t,pick}=useLang();const {data,loading,error}=useData(k,[]);const [q,setQ]=useState('');
 const items=data.filter(i=>!q||JSON.stringify(i).toLowerCase().includes(q.toLowerCase())).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
 return(<><PageHead title={pick(sec(k))}/><div className="mx-auto max-w-7xl px-4 py-8">
 {k==='emergency'&&<a href="tel:112" className="btn btn-saffron mb-6">112 — {t('emergency112')}</a>}
 <input aria-label={t('search')} placeholder={t('search')} value={q} onChange={e=>setQ(e.target.value)} className="mb-6 block w-full max-w-md rounded-lg border border-soil/30 bg-white px-4 py-3"/>
 <Status loading={loading} error={error} empty={!items.length}><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map(i=><ItemCard key={i.id} it={i}/>)}</div></Status></div></>)}
