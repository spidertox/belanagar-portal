import {useState} from 'react';
import {api} from '../lib/api.js';
import {useLang} from '../i18n/index.jsx';
import {PageHead} from '../components/UI.jsx';
const TYPES={contact:['संपर्क संदेश','Contact message'],correction:['सुधार','Correction'],place:['नया स्थान','New place'],business:['व्यवसाय','Business'],history:['ऐतिहासिक जानकारी','Historical information'],photo:['फ़ोटो','Photo'],event:['कार्यक्रम','Event']};
export default function Contact(){const {t,lang}=useLang();const i=lang==='hi'?0:1;const [f,setF]=useState({type:'contact'}),[st,setSt]=useState('');
 const set=k=>e=>setF({...f,[k]:e.target.value}),c='w-full rounded-lg border border-soil/30 bg-white px-3 py-2';
 const go=async e=>{e.preventDefault();setSt('busy');try{await api(f.type==='contact'?'contact':'suggest',{method:'POST',body:f});setSt('ok');setF({type:'contact'})}catch(x){setSt(x.status===429?'rate':'err')}};
 return(<><PageHead title={t('contactTitle')} sub={t('helpSub')}/><form onSubmit={go} className="mx-auto max-w-xl space-y-4 px-4 py-8">
 <label className="block">{t('type')}<select className={c} value={f.type} onChange={set('type')}>{Object.entries(TYPES).map(([k,v])=><option key={k} value={k}>{v[i]}</option>)}</select></label>
 <label className="block">{t('name')}<input required minLength={2} className={c} value={f.name||''} onChange={set('name')}/></label>
 <label className="block">{t('contactF')}<input required minLength={3} className={c} value={f.contact||''} onChange={set('contact')}/></label>
 <label className="block">{t('subject')}<input className={c} value={f.subject||''} onChange={set('subject')}/></label>
 <label className="block">{t('message')}<textarea required minLength={5} rows={5} className={c} value={f.message||''} onChange={set('message')}/></label>
 <input name="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={f.hp||''} onChange={set('hp')}/>
 <p className="text-sm text-ink/70">{t('notice')}</p>
 {st==='ok'&&<p role="status" className="font-medium text-leaf">{t('sent')}</p>}
 {(st==='err'||st==='rate')&&<p role="alert" className="text-red-700">{t(st)}</p>}
 <button disabled={st==='busy'} className="btn btn-saffron">{t('send')}</button></form></>)}
