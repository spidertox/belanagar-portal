import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {motion,useReducedMotion} from 'framer-motion';
import {useLang} from '../i18n/index.jsx';
import {CAT,SEC_EMOJI} from '../data/categories.js';
import {Ornament} from './Art.jsx';
export const usePageTitle=t=>useEffect(()=>{document.title=(t?t+' | ':'')+'Belanagar — बेलानगर'},[t]);
export function Reveal({children,d=0,className=''}){const r=useReducedMotion();
 return <motion.div className={className} initial={r?false:{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-40px'}} transition={{duration:.5,delay:d}}>{children}</motion.div>}
export function SectionTitle({title,sub,left}){
 return(<div className={'mb-8 '+(left?'':'text-center')}><h2 className="font-display text-3xl text-leaf sm:text-4xl">{title}</h2>
 <Ornament className={'mt-2 h-6 w-32 '+(left?'':'mx-auto')}/>{sub&&<p className={'mt-3 max-w-2xl text-ink/75 '+(left?'':'mx-auto')}>{sub}</p>}</div>)}
export function PageHead({title,sub}){usePageTitle(title);
 return(<div className="relative overflow-hidden bg-leaf text-cream"><div className="pattern absolute inset-0"/><div className="relative mx-auto max-w-7xl px-4 py-12"><h1 className="font-display text-4xl sm:text-5xl">{title}</h1><Ornament className="mt-2 h-6 w-32"/>{sub&&<p className="mt-3 max-w-2xl text-cream/85">{sub}</p>}</div></div>)}
export function Status({loading,error,empty,children}){const {t}=useLang();
 if(loading)return <p role="status" className="py-12 text-center">{t('loading')}</p>;
 if(error)return <p role="alert" className="py-12 text-center">{t('err')}</p>;
 if(empty)return <p className="py-12 text-center text-soil">{t('empty')}</p>;
 return children}
// click-to-enlarge image with a full-screen viewer (Esc or tap to close)
export function Zoomable({src,alt,className='',fit='cover'}){const [open,setOpen]=useState(false);
 useEffect(()=>{if(!open)return;const f=e=>e.key==='Escape'&&setOpen(false);window.addEventListener('keydown',f);return()=>window.removeEventListener('keydown',f)},[open]);
 return(<><button type="button" aria-label={'Zoom: '+(alt||'')} onClick={()=>setOpen(true)} className={'block w-full cursor-zoom-in '+className}><img src={src} alt={alt||''} loading="lazy" className={'h-full w-full '+(fit==='contain'?'object-contain':'object-cover')}/></button>
 {open&&<div role="dialog" aria-modal="true" aria-label={alt} className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-4" onClick={()=>setOpen(false)}>
  <button type="button" aria-label="Close" onClick={()=>setOpen(false)} className="absolute right-3 top-3 grid size-11 place-items-center rounded-full bg-white/15 text-2xl text-white">×</button>
  <img src={src} alt={alt||''} className="max-h-[92vh] max-w-full rounded-lg object-contain"/></div>}</>)}
const esc=s=>String(s||'').replace(/[\r\n,;\\]/g,' ');
const ics=it=>{const next=new Date(new Date(it.date+'T00:00:00').getTime()+864e5),p=n=>String(n).padStart(2,'0');
 return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Belanagar//EN','BEGIN:VEVENT','UID:'+esc(it.id)+'@belanagar','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z','DTSTART;VALUE=DATE:'+it.date.replace(/-/g,''),'DTEND;VALUE=DATE:'+next.getFullYear()+p(next.getMonth()+1)+p(next.getDate()),'SUMMARY:'+esc(it.title),'LOCATION:'+esc(it.venue),'DESCRIPTION:'+esc(it.time),'END:VEVENT','END:VCALENDAR'].join('\r\n')};
const daysTo=d=>Math.round((new Date(d+'T00:00:00')-new Date().setHours(0,0,0,0))/864e5);
const HIDE=new Set(['id','c','published','consent','created','source','source_url','name','title','caption','image','cover','photo','poster','website','lat','lng']);
export function ItemCard({it,k}){const {t,lab,lang}=useLang();
 const img=it.image||it.cover||it.photo||it.poster,head=it.name||it.title||it.caption,tel=(it.phone||'').replace(/[^\d+]/g,'');
 const cat=CAT[it.category]||CAT[it.c],pinned=it.lat!=null&&it.lng!=null,days=k==='events'&&it.date?daysTo(it.date):null;
 return(<article className="card flex h-full flex-col overflow-hidden">
 {img?<Zoomable src={img} alt={head} className="h-44"/>
 :<div aria-hidden="true" className="relative grid h-28 place-items-center bg-gradient-to-br from-leaf to-leaf2 text-5xl"><span className="pattern absolute inset-0"/><span className="relative">{cat?.e||SEC_EMOJI[k]||'📍'}</span></div>}
 <div className="flex flex-1 flex-col gap-2 p-4">
  <div className="flex flex-wrap gap-2">
   {cat&&<span className="w-fit rounded-full px-2.5 py-0.5 text-xs font-medium text-white" style={{background:cat.c}}>{cat[lang]}</span>}
   {days!=null&&days>=0&&<span className="w-fit rounded-full bg-saffron px-3 py-0.5 text-xs font-semibold text-ink">{days===0?t('today'):t('daysLeft').replace('{n}',days)}</span>}</div>
  <h3 className="font-display text-xl leading-snug text-leaf">{head}</h3>
  <dl className="space-y-1 text-sm">{Object.entries(it).filter(([x,v])=>!HIDE.has(x)&&!(x==='category'&&cat)&&v!==''&&v!=null).map(([x,v])=><div key={x}><dt className="inline text-soil">{lab(x)}: </dt><dd className="inline">{String(v)}</dd></div>)}</dl>
  <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
   {tel&&<a className="btn btn-saffron" href={'tel:'+tel}>{t('call')}</a>}
   {/^https:\/\//.test(it.website||'')&&<a className="btn btn-saffron" target="_blank" rel="noopener noreferrer" href={it.website}>{t('visit')}</a>}
   {pinned?<><Link className="btn btn-saffron" to={'/map?focus='+it.id}>{t('showOnMap')}</Link><a className="btn border border-soil/40" target="_blank" rel="noopener noreferrer" href={`https://www.openstreetmap.org/directions?to=${it.lat}%2C${it.lng}`}>{t('directions')}</a></>
   :(k==='places'||k==='schools')&&<span className="rounded-full bg-soil/10 px-3 py-1 text-xs text-soil">{t('pinSoon')}</span>}
   {k==='events'&&it.date&&<a className="btn border border-soil/40" download="event.ics" href={'data:text/calendar;charset=utf-8,'+encodeURIComponent(ics(it))}>{t('calendar')}</a>}</div>
  {(it.source||it.source_url)&&<p className="text-xs text-ink/70">{t('source')}: {/^https:\/\//.test(it.source_url||'')?<a className="underline" href={it.source_url} rel="noopener noreferrer">{it.source||it.source_url}</a>:it.source}</p>}
 </div></article>)}
