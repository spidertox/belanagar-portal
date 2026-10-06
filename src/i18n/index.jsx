import {createContext,useContext,useEffect,useState} from 'react';
const d=(hi,en)=>({hi,en});
export const S={
tagline:d('हमारी मिट्टी, हमारी पहचान','Our Soil, Our Identity'),
heroSub:d('बेलानगर — हमारा गाँव, हमारी पहचान','Belanagar — Our Village, Our Identity'),
explore:d('बेलानगर देखें','Explore Belanagar'),map:d('गाँव का नक्शा','Village map'),locate:d('पूरा गाँव दिखाएँ','Show whole village'),all:d('सभी','All'),
soon:d('जानकारी जल्द आएगी','Data coming soon'),
na:d('जानकारी अभी उपलब्ध नहीं है','Information not available yet'),
empty:d('अभी कोई जानकारी नहीं जोड़ी गई है।','No information has been added yet.'),
loading:d('लोड हो रहा है…','Loading…'),
err:d('कुछ गड़बड़ हो गई। कृपया फिर से कोशिश करें।','Something went wrong. Please try again.'),
rate:d('बहुत अधिक प्रयास। कुछ देर बाद फिर कोशिश करें।','Too many attempts. Please try again later.'),
viewAll:d('सभी देखें','View all'),search:d('खोजें','Search'),source:d('स्रोत','Source'),
directions:d('रास्ता देखें','Get directions'),call:d('कॉल करें','Call'),about:d('बेलानगर के बारे में','About Belanagar'),
population:d('जनसंख्या','Population'),households:d('परिवार','Households'),schools:d('विद्यालय','Schools'),places:d('स्थान','Places'),festivals:d('त्योहार','Festivals'),businesses:d('स्थानीय व्यवसाय','Local businesses'),
emergency112:d('राष्ट्रीय आपातकालीन नंबर','National emergency number'),
built:d('बेलानगर की डिजिटल पहचान के लिए बनाया गया','Built for the digital identity of Belanagar'),
help:d('बेलानगर को बेहतर बनाने में मदद करें','Help improve Belanagar'),
helpSub:d('सुधार, नया स्थान, व्यवसाय, इतिहास, फ़ोटो या कार्यक्रम सुझाएँ।','Suggest a correction, place, business, history, photo or event.'),
contactTitle:d('बेलानगर से संपर्क करें','Contact Belanagar'),
name:d('नाम','Name'),contactF:d('फ़ोन या ईमेल','Phone or email'),subject:d('विषय','Subject'),message:d('संदेश','Message'),type:d('प्रकार','Type'),send:d('भेजें','Send'),
sent:d('धन्यवाद! आपका संदेश भेज दिया गया है।','Thank you! Your message has been sent.'),
notice:d('आपका संदेश टेलीग्राम के ज़रिए साइट प्रशासक तक पहुँचता है।','Your message reaches the site admin through Telegram.')};
export const L={category:d('श्रेणी','Category'),type:d('प्रकार','Type'),description:d('विवरण','Details'),body:d('विवरण','Details'),summary:d('सारांश','Summary'),address:d('पता','Address'),contact:d('संपर्क','Contact'),phone:d('फ़ोन','Phone'),hours:d('समय','Hours'),date:d('तिथि','Date'),time:d('समय','Time'),venue:d('स्थान','Venue'),organizer:d('आयोजक','Organizer'),status:d('स्थिति','Status'),authority:d('प्राधिकरण','Authority'),profession:d('पेशा','Profession'),achievement:d('उपलब्धि','Achievement'),bio:d('परिचय','About'),note:d('टिप्पणी','Note'),priority:d('प्राथमिकता','Priority'),expires:d('समाप्ति','Expires'),tradition:d('परंपरा','Tradition'),dates:d('तिथियाँ','Dates'),committee:d('समिति','Committee'),website:d('वेबसाइट','Website'),message:d('संदेश','Message')};
const Ctx=createContext(null);
export function LangProvider({children}){
 const [lang,setLang]=useState(()=>{try{return localStorage.getItem('bn_lang')==='en'?'en':'hi'}catch{return 'hi'}});
 useEffect(()=>{document.documentElement.lang=lang;try{localStorage.setItem('bn_lang',lang)}catch{}},[lang]);
 const v={lang,toggle:()=>setLang(l=>l==='hi'?'en':'hi'),t:k=>S[k]?.[lang]||k,pick:o=>o[lang],lab:k=>L[k]?.[lang]||k.replace(/_/g,' ')};
 return <Ctx.Provider value={v}>{children}</Ctx.Provider>}
export const useLang=()=>useContext(Ctx);
