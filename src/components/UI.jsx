import {useEffect} from 'react';
import {useLang} from '../i18n/index.jsx';
export const usePageTitle=t=>useEffect(()=>{document.title=(t?t+' | ':'')+'Belanagar — बेलानगर'},[t]);
export function PageHead({title,sub}){usePageTitle(title);
 return(<div className="bg-leaf text-cream"><div className="mx-auto max-w-7xl px-4 py-10"><h1 className="font-display text-4xl md:text-5xl">{title}</h1>{sub&&<p className="mt-2 max-w-2xl text-cream/85">{sub}</p>}</div></div>)}
export function Status({loading,error,empty,children}){const {t}=useLang();
 if(loading)return <p role="status" className="py-12 text-center">{t('loading')}</p>;
 if(error)return <p role="alert" className="py-12 text-center">{t('err')}</p>;
 if(empty)return <p className="py-12 text-center text-soil">{t('empty')}</p>;
 return children}
const HIDE=new Set(['id','published','consent','created','source','source_url','name','title','caption','image','cover','photo','poster','lat','lng']);
export function ItemCard({it}){const {t,lab}=useLang();
 const img=it.image||it.cover||it.photo||it.poster,head=it.name||it.title||it.caption,tel=(it.phone||'').replace(/[^\d+]/g,'');
 return(<article className="flex flex-col overflow-hidden rounded-xl border border-soil/20 bg-white">
 {img&&<img src={img} alt={head||''} loading="lazy" className="h-44 w-full object-cover"/>}
 <div className="flex flex-1 flex-col gap-2 p-4"><h3 className="font-display text-xl text-leaf">{head}</h3>
 <dl className="space-y-1 text-sm">{Object.entries(it).filter(([k,v])=>!HIDE.has(k)&&v!==''&&v!=null).map(([k,v])=><div key={k}><dt className="inline text-soil">{lab(k)}: </dt><dd className="inline">{String(v)}</dd></div>)}</dl>
 <div className="mt-auto flex flex-wrap gap-2">
  {tel&&<a className="btn btn-saffron" href={'tel:'+tel}>{t('call')}</a>}
  {it.lat!=null&&it.lng!=null&&<a className="btn border border-soil/40" target="_blank" rel="noopener noreferrer" href={`https://www.openstreetmap.org/directions?to=${it.lat}%2C${it.lng}`}>{t('directions')}</a>}</div>
 {(it.source||it.source_url)&&<p className="text-xs text-ink/70">{t('source')}: {/^https:\/\//.test(it.source_url||'')?<a className="underline" href={it.source_url} rel="noopener noreferrer">{it.source||it.source_url}</a>:it.source}</p>}
 </div></article>)}
