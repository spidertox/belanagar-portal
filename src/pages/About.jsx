import {useData} from '../lib/api.js';
import {useLang} from '../i18n/index.jsx';
import {VILLAGE} from '../data/sections.js';
import {PageHead,Status} from '../components/UI.jsx';
const LV={name:['गाँव का नाम','Village name'],panchayat:['पंचायत','Panchayat'],block:['प्रखंड','Block'],district:['जिला','District'],state:['राज्य','State'],pin:['पिन कोड','PIN code'],police_station:['थाना','Police station'],railway:['निकटतम रेलवे स्टेशन','Nearest railway station'],town:['निकटतम शहर','Nearest town'],area:['क्षेत्रफल','Area'],elevation:['ऊँचाई','Elevation'],male:['पुरुष','Male'],female:['महिलाएँ','Female'],lat:['अक्षांश','Latitude'],lng:['देशांतर','Longitude'],population:['जनसंख्या','Population'],households:['परिवार','Households'],literacy:['साक्षरता','Literacy'],languages:['भाषाएँ','Languages'],source:['स्रोत','Source'],last_updated:['अंतिम अपडेट','Last updated']};
export default function About(){const {t,lang}=useLang();const {data:v,loading,error}=useData('village',{});const i=lang==='hi'?0:1;
 return(<><PageHead title={t('about')} sub={v.intro}/><div className="mx-auto max-w-4xl px-4 py-8">
 <Status loading={loading} error={error} empty={!Object.keys(v).length}><dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
 {VILLAGE.filter(k=>k!=='intro').map(k=><div key={k} className="border-b border-soil/20 pb-2"><dt className="text-sm text-soil">{LV[k][i]}</dt><dd>{v[k]||t('na')}</dd></div>)}</dl></Status></div></>)}
