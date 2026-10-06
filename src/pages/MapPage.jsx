import {useEffect,useRef,useState} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {useData} from '../lib/api.js';
import {useLang} from '../i18n/index.jsx';
import {BOUNDARY,RAJDHANI} from '../data/boundary.js';
import {inBoundary} from '../lib/geo.js';
import {PageHead} from '../components/UI.jsx';
const CATS=[['education','🏫','शिक्षा','Education'],['religious','🛕','धार्मिक','Religious'],['health','🏥','स्वास्थ्य','Health'],['business','🏪','व्यवसाय','Business'],['government','🏛','सरकारी','Government'],['emergency','🚓','आपातकालीन','Emergency'],['event','🎉','आयोजन स्थल','Event spots']];
const popup=(x,label)=>{const d=document.createElement('div'),b=document.createElement('b');b.textContent=x.name||x.title;d.append(b);
 [x.category||x.type,x.description,x.address,x.contact||x.phone].filter(Boolean).forEach(s=>{const p=document.createElement('div');p.textContent=s;d.append(p)});
 const a=document.createElement('a');a.href=`https://www.openstreetmap.org/directions?to=${x.lat}%2C${x.lng}`;a.target='_blank';a.rel='noopener noreferrer';a.textContent=label;d.append(a);return d};
export default function MapPage(){
 const {t,lang}=useLang(),i=lang==='hi'?2:3;
 const P=useData('places',[]).data,S=useData('schools',[]).data,B=useData('businesses',[]).data;
 const [cat,setCat]=useState(''),el=useRef(null),map=useRef(null),layer=useRef(null);
 const pts=[...P.map(x=>({...x,c:x.category})),...S.map(x=>({...x,c:'education'})),...B.map(x=>({...x,c:'business'}))].filter(x=>Number.isFinite(x.lat)&&Number.isFinite(x.lng)&&inBoundary(x.lat,x.lng)&&(!cat||x.c===cat));
 useEffect(()=>{
  const m=L.map(el.current);map.current=m;
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(m);
  const v=L.polygon(BOUNDARY,{color:'#1f4d2b',weight:3,fillColor:'#1f4d2b',fillOpacity:.1}).addTo(m);v.bindTooltip('बेलानगर / Belanagar',{sticky:true});
  L.polygon(RAJDHANI,{color:'#e8891c',weight:2,fillOpacity:.3}).addTo(m).bindTooltip('राजधानी',{sticky:true});
  m.fitBounds(v.getBounds(),{padding:[20,20]});layer.current=L.layerGroup().addTo(m);
  return()=>m.remove()},[]);
 useEffect(()=>{const g=layer.current;g.clearLayers();
  pts.forEach(x=>L.marker([x.lat,x.lng],{icon:L.divIcon({className:'bn-pin',iconSize:[18,18]}),title:x.name||x.title}).bindPopup(popup(x,t('directions'))).addTo(g))},[P,S,B,cat,lang]);
 return(<><PageHead title={t('map')}/><div className="mx-auto max-w-7xl px-4 py-6">
  <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter">
   <button aria-pressed={!cat} className={'btn border border-soil/40 '+(!cat?'btn-saffron':'')} onClick={()=>setCat('')}>{t('all')}</button>
   {CATS.map(c=><button key={c[0]} aria-pressed={cat===c[0]} className={'btn border border-soil/40 '+(cat===c[0]?'btn-saffron':'')} onClick={()=>setCat(c[0])}>{c[1]} {c[i]}</button>)}
   <button className="btn border border-soil/40" onClick={()=>map.current.fitBounds(L.latLngBounds(BOUNDARY),{padding:[20,20]})}>{t('locate')}</button></div>
  <div ref={el} role="region" aria-label={t('map')} className="isolate h-[65vh] w-full rounded-xl border border-soil/20"/></div></>)}
