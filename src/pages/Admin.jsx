import {useEffect,useRef,useState} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {BOUNDARY} from '../data/boundary.js';
import {inBoundary} from '../lib/geo.js';
import {api} from '../lib/api.js';
import {SECTIONS,VILLAGE,SELECT} from '../data/sections.js';
import {PageHead} from '../components/UI.jsx';
import SEED from '../data/seed.json';
const TA=new Set(['description','body','summary','message','bio','intro','achievement','tradition','note']),DT=new Set(['date','expires','last_updated']);
const IN='w-full rounded-lg border border-soil/30 bg-white px-3 py-2';
function Field({k,sec,v,set}){const o=SELECT[sec+'.'+k],id='f-'+sec+k;
 return(<label htmlFor={id} className="block text-sm"><span className="text-soil">{k.replace(/_/g,' ')}</span>
 {o?<select id={id} className={IN} value={v??''} onChange={e=>set(e.target.value)}><option value=""></option>{o.map(x=><option key={x}>{x}</option>)}</select>
 :TA.has(k)?<textarea id={id} rows={4} className={IN} value={v??''} onChange={e=>set(e.target.value)}/>
 :<input id={id} step="any" type={DT.has(k)?'date':(k==='lat'||k==='lng')?'number':'text'} className={IN} value={v??''} onChange={e=>set(e.target.value)}/>}</label>)}
function Login({done}){const [pw,setPw]=useState(''),[err,setErr]=useState('');
 const go=async e=>{e.preventDefault();setErr('');try{await api('admin/login',{method:'POST',body:{password:pw}});done()}catch(x){setErr(x.status===503?'Server setup required: add the environment variables in Vercel.':x.status===429?'Too many attempts. Try again later.':'Incorrect password.')}};
 return(<><PageHead title="Admin login"/><form onSubmit={go} className="mx-auto max-w-sm space-y-4 px-4 py-10"><label className="block">Password<input type="password" autoComplete="current-password" required className={IN} value={pw} onChange={e=>setPw(e.target.value)}/></label>
 {err&&<p role="alert" className="text-red-700">{err}</p>}<button className="btn btn-saffron w-full">Log in</button></form></>)}
function Import(){const [m,setM]=useState('');
 const go=async()=>{if(!window.confirm('Import the Belanagar starter data (village profile, places, school, news)? Entries with the same name are skipped.'))return;setM('Importing…');try{const r=await api('admin/import',{method:'POST',body:SEED});setM('Done: '+r.added+' new entries added.')}catch{setM('Import failed. Check the server setup.')}};
 return(<div className="mt-6 flex flex-wrap items-center gap-3"><button className="btn btn-saffron" onClick={go}>Import starter data</button><span role="status">{m}</span></div>)}
function Overview(){const [c,setC]=useState(null);useEffect(()=>{api('admin/overview').then(setC).catch(()=>setC({}))},[]);
 return(<><dl className="grid grid-cols-2 gap-4 md:grid-cols-4">{SECTIONS.map(s=><div key={s.k} className="rounded-xl border border-soil/20 bg-white p-4"><dt className="text-sm text-soil">{s.en}</dt><dd className="font-display text-3xl">{c?c[s.k]??0:'…'}</dd></div>)}</dl><Import/></>)}
function Village(){const [v,setV]=useState(null),[msg,setMsg]=useState('');
 useEffect(()=>{api('admin/village').then(setV).catch(()=>setMsg('Could not load.'))},[]);
 if(!v)return <p>{msg||'Loading…'}</p>;
 const save=async e=>{e.preventDefault();try{setV(await api('admin/village',{method:'PUT',body:v}));setMsg('Saved.')}catch{setMsg('Save failed.')}};
 return(<form onSubmit={save} className="grid max-w-3xl gap-3 sm:grid-cols-2">{VILLAGE.map(f=><Field key={f} k={f} sec="village" v={v[f]} set={x=>setV({...v,[f]:x})}/>)}
 <div className="sm:col-span-2"><button className="btn btn-saffron">Save</button> <span role="status">{msg}</span></div></form>)}
function PinPicker({lat,lng,set}){
 const el=useRef(null),map=useRef(null),mk=useRef(null),[msg,setMsg]=useState('Tap inside the green boundary to place the pin.');
 const put=(la,ln)=>{if(!inBoundary(la,ln)){setMsg('That spot is outside the Belanagar boundary.');return}setMsg('Pin set. Tap again to move it.');set(+la.toFixed(6),+ln.toFixed(6))};
 useEffect(()=>{const m=L.map(el.current);map.current=m;
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(m);
  m.fitBounds(L.polygon(BOUNDARY,{color:'#1f4d2b',weight:3,fillOpacity:.08}).addTo(m).getBounds());
  m.on('click',e=>put(e.latlng.lat,e.latlng.lng));return()=>m.remove()},[]);
 useEffect(()=>{const m=map.current;if(mk.current){mk.current.remove();mk.current=null}
  if(lat!=null&&lat!==''&&lng!=null&&lng!=='')mk.current=L.marker([+lat,+lng],{icon:L.divIcon({className:'bn-pin',iconSize:[18,18]})}).addTo(m)},[lat,lng]);
 return(<div><div ref={el} role="region" aria-label="Pick location" className="isolate h-64 w-full rounded-xl border border-soil/20"/>
  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm"><button type="button" className="btn border border-soil/40" onClick={()=>navigator.geolocation?.getCurrentPosition(p=>put(p.coords.latitude,p.coords.longitude),()=>setMsg('Could not get your location.'),{enableHighAccuracy:true})}>Use my location</button><span role="status">{msg}</span></div></div>)}
function Crud({k}){const s=SECTIONS.find(x=>x.k===k);const [items,setItems]=useState([]),[ed,setEd]=useState(null),[msg,setMsg]=useState('');
 const load=()=>api('admin/'+k).then(setItems).catch(()=>setMsg('Could not load. Check the server setup.'));
 useEffect(()=>{load()},[k]);
 const save=async e=>{e.preventDefault();setMsg('');try{ed.id?await api(`admin/${k}/${ed.id}`,{method:'PUT',body:ed}):await api('admin/'+k,{method:'POST',body:ed});setEd(null);load()}catch(x){setMsg(x.message==='outside'?'The pin must be inside the Belanagar boundary.':'Save failed.')}};
 const del=async i=>{if(!window.confirm('Delete this entry? This cannot be undone.'))return;try{await api(`admin/${k}/${i.id}`,{method:'DELETE'});load()}catch{setMsg('Delete failed.')}};
 return(<div>{msg&&<p role="alert" className="mb-3 text-red-700">{msg}</p>}
 {ed?<form onSubmit={save} className="grid max-w-3xl gap-3 sm:grid-cols-2">{s.f.includes('lat')&&<div className="sm:col-span-2"><PinPicker lat={ed.lat} lng={ed.lng} set={(la,ln)=>setEd(e=>({...e,lat:la,lng:ln}))}/></div>}{s.f.map(f=><Field key={f} k={f} sec={k} v={ed[f]} set={x=>setEd({...ed,[f]:x})}/>)}
  <label className="flex items-center gap-2"><input type="checkbox" checked={ed.published!==false} onChange={e=>setEd({...ed,published:e.target.checked})}/>Published</label>
  <div className="flex gap-2 sm:col-span-2"><button className="btn btn-saffron">Save</button><button type="button" className="btn border border-soil/40" onClick={()=>setEd(null)}>Cancel</button></div></form>
 :<><button className="btn btn-saffron mb-4" onClick={()=>setEd({})}>Add new</button>
  {items.length?<ul>{items.map(i=><li key={i.id} className="flex items-center gap-2 border-b border-soil/20 py-2"><span className="mr-auto">{i.name||i.title||i.caption||i.type||i.id}{i.published===false&&' (hidden)'}</span>
   <button className="btn border border-soil/40" onClick={()=>setEd(i)}>Edit</button><button className="btn border border-red-700 text-red-700" onClick={()=>del(i)}>Delete</button></li>)}</ul>:<p>No information has been added yet.</p>}</>}</div>)}
function Dash({out}){const [tab,setTab]=useState('overview');const tabs=['overview','village',...SECTIONS.map(s=>s.k)];
 return(<><PageHead title="Admin"/><div className="mx-auto max-w-7xl px-4 py-6"><div className="flex gap-2 overflow-x-auto pb-4" role="tablist">
 {tabs.map(x=><button key={x} role="tab" aria-selected={tab===x} onClick={()=>setTab(x)} className={'btn whitespace-nowrap capitalize '+(tab===x?'btn-saffron':'border border-soil/40')}>{x}</button>)}
 <button className="btn ml-auto border border-soil/40" onClick={out}>Log out</button></div>
 {tab==='overview'?<Overview/>:tab==='village'?<Village/>:<Crud key={tab} k={tab}/>}</div></>)}
export default function Admin(){const [ses,setSes]=useState(null);
 useEffect(()=>{api('admin/session').then(r=>setSes(r.admin)).catch(()=>setSes(false))},[]);
 if(ses===null)return <p role="status" className="py-12 text-center">Loading…</p>;
 return ses?<Dash out={()=>api('admin/logout',{method:'POST'}).finally(()=>setSes(false))}/>:<Login done={()=>setSes(true)}/>}
