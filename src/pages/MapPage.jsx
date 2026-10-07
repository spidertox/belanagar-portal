import {useMemo,useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {useLang} from '../i18n/index.jsx';
import {useAllPlaces} from '../lib/places.js';
import {CAT} from '../data/categories.js';
import VillageMap from '../components/VillageMap.jsx';
import {PageHead,Status} from '../components/UI.jsx';
export default function MapPage(){
 const {t,lang}=useLang(),[sp]=useSearchParams(),{all:items,pinned,loading,error}=useAllPlaces();
 const [cat,setCat]=useState(''),[focus,setFocus]=useState(sp.get('focus')?{id:sp.get('focus'),n:1}:null);
 const pts=useMemo(()=>cat?pinned.filter(x=>x.c===cat):pinned,[pinned,cat]);
 const list=cat?items.filter(x=>x.c===cat):items,used=Object.keys(CAT).filter(k=>items.some(x=>x.c===k));
 const go=id=>{setFocus({id,n:Date.now()});document.getElementById('villagemap')?.scrollIntoView({behavior:'smooth',block:'center'})};
 const chip=on=>'btn border '+(on?'btn-saffron border-saffron':'border-soil/40 bg-white');
 return(<><PageHead title={t('map')} sub={t('mapSub')}/><div className="mx-auto max-w-7xl px-4 py-6">
  <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter">
   <button aria-pressed={!cat} className={chip(!cat)} onClick={()=>setCat('')}>{t('all')}</button>
   {used.map(k=><button key={k} aria-pressed={cat===k} className={chip(cat===k)} onClick={()=>setCat(k)}>{CAT[k].e} {CAT[k][lang]}</button>)}
   <button className="btn border border-soil/40 bg-white" onClick={()=>go('__village')}>{t('locate')}</button><a className="btn border border-soil/40 bg-white" href="/belanagar-boundary.kml" download>{t('kml')}</a></div>
  <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
   <VillageMap id="villagemap" points={pts} focus={focus} className="h-[58vh] lg:h-[74vh]"/>
   <Status loading={loading} error={error} empty={!list.length}><ul className="space-y-3 lg:max-h-[74vh] lg:overflow-y-auto lg:pr-1">
    {list.map(x=>{const ok=pts.includes(x);return(<li key={x.id} className="card flex gap-3 p-3">
     <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full text-xl text-white" style={{background:(CAT[x.c]||{}).c||'#e8891c'}}>{(CAT[x.c]||{}).e||'📍'}</span>
     <div className="min-w-0 flex-1"><h3 className="font-display text-lg leading-tight text-leaf">{x.name||x.title}</h3>
      {(x.address||x.venue)&&<p className="text-sm text-ink/75">{x.address||x.venue}</p>}
      <div className="mt-2 flex flex-wrap items-center gap-2">
       {ok?<><button className="btn btn-saffron" onClick={()=>go(x.id)}>{t('showOnMap')}</button><a className="btn border border-soil/40" target="_blank" rel="noopener noreferrer" href={`https://www.openstreetmap.org/directions?to=${x.lat}%2C${x.lng}`}>{t('directions')}</a></>:<span className="rounded-full bg-soil/10 px-3 py-1 text-xs text-soil">{t('pinSoon')}</span>}</div></div></li>)})}</ul></Status></div></div></>)}
