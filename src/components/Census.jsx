import {useLang} from '../i18n/index.jsx';
import {CENSUS} from '../data/census.js';
const ROWS=[['population','जनसंख्या','Population'],['children','बच्चे (0–6 आयु)','Children (age 0–6)'],['literate','साक्षर','Literate'],['illiterate','निरक्षर','Illiterate'],['workers','कार्यकर्ता','Workers'],['nonworkers','गैर-कार्यकर्ता','Non-workers'],['sc','अनुसूचित जाति','Scheduled Castes'],['st','अनुसूचित जनजाति','Scheduled Tribes']];
const n=x=>x.toLocaleString('en-IN');
export default function Census(){const {t,lang}=useLang(),i=lang==='hi'?1:2;
 return(<div>
  <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
   <span className="inline-flex items-center gap-2"><span className="inline-block size-3 rounded-full bg-leaf"/>{t('male')}</span>
   <span className="inline-flex items-center gap-2"><span className="inline-block size-3 rounded-full bg-saffron"/>{t('female')}</span>
   <span className="rounded-full bg-leaf/10 px-3 py-1">🏠 {t('households')}: <b>{n(CENSUS.households)}</b></span></div>
  <div className="grid gap-4 sm:grid-cols-2">{ROWS.map(r=>{const [tot,m,f]=CENSUS.rows[r[0]];return(
   <div key={r[0]} className="card p-4">
    <div className="flex items-baseline justify-between gap-3"><h3 className="font-display text-lg text-leaf">{r[i]}</h3><b className="font-display text-2xl">{n(tot)}</b></div>
    <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-soil/10" role="img" aria-label={`${t('male')} ${n(m)}, ${t('female')} ${n(f)}`}>{tot>0&&<><div className="bg-leaf" style={{width:(m/tot*100)+'%'}}/><div className="bg-saffron" style={{width:(f/tot*100)+'%'}}/></>}</div>
    <div className="mt-2 flex justify-between text-sm text-ink/80"><span>{t('male')}: {n(m)}</span><span>{t('female')}: {n(f)}</span></div></div>)})}</div>
  <p className="mt-4 text-xs text-ink/70">{t('source')}: {CENSUS.source}</p></div>)}
