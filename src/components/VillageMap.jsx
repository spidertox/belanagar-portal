import {useEffect,useRef} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {BOUNDARY,RAJDHANI} from '../data/boundary.js';
import {CAT} from '../data/categories.js';
import {useLang} from '../i18n/index.jsx';
const icon=c=>{const k=CAT[c]||{};return L.divIcon({className:'',iconSize:[36,44],iconAnchor:[18,43],popupAnchor:[0,-40],html:`<div class="bn-pin" style="--c:${k.c||'#e8891c'}"><span>${k.e||'📍'}</span></div>`})};
const popup=(x,t,lang)=>{const d=document.createElement('div');d.className='bn-pop';
 const b=document.createElement('b');b.textContent=x.name||x.title;d.append(b);
 const k=CAT[x.c];if(k){const s=document.createElement('small');s.textContent=k[lang];d.append(s)}
 [x.description,x.address].filter(Boolean).forEach(s=>{const p=document.createElement('p');p.textContent=s;d.append(p)});
 const a=document.createElement('a');a.href=`https://www.openstreetmap.org/directions?to=${x.lat}%2C${x.lng}`;a.target='_blank';a.rel='noopener noreferrer';a.textContent=t('directions')+' →';d.append(a);return d};
export default function VillageMap({points,focus,className='',id}){
 const {t,lang}=useLang(),el=useRef(null),map=useRef(null),layer=useRef(null),mk=useRef({}),done=useRef(null);
 useEffect(()=>{const m=L.map(el.current,{scrollWheelZoom:false});map.current=m;
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(m);
  const v=L.polygon(BOUNDARY,{color:'#1f4d2b',weight:3,fillColor:'#2f6b3c',fillOpacity:.12,dashArray:'8 6'}).addTo(m);v.bindTooltip('बेलानगर / Belanagar',{sticky:true});
  L.polygon(RAJDHANI,{color:'#e8891c',weight:2,fillColor:'#e8891c',fillOpacity:.3}).addTo(m).bindTooltip('राजधानी',{sticky:true});
  m.fitBounds(v.getBounds(),{padding:[16,16]});layer.current=L.layerGroup().addTo(m);
  m.once('click',()=>m.scrollWheelZoom.enable());
  return()=>m.remove()},[]);
 useEffect(()=>{const g=layer.current;g.clearLayers();mk.current={};
  points.forEach(x=>{mk.current[x.id]=L.marker([x.lat,x.lng],{icon:icon(x.c),title:x.name||x.title,alt:x.name||x.title}).bindPopup(popup(x,t,lang)).addTo(g)})},[points,lang]);
 useEffect(()=>{if(!focus)return;const m=map.current;
  if(focus.id==='__village'){done.current=focus;m.flyToBounds(L.latLngBounds(BOUNDARY),{padding:[16,16],duration:.8});return}
  const x=mk.current[focus.id];if(x&&done.current!==focus){done.current=focus;m.flyTo(x.getLatLng(),17,{duration:.8});x.openPopup()}},[focus,points]);
 return <div ref={el} id={id} role="region" aria-label={t('map')} className={'isolate w-full overflow-hidden rounded-2xl border border-soil/20 shadow-lg '+className}/>}
