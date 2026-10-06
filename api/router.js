import crypto from 'node:crypto';
import {inBoundary} from '../src/lib/geo.js';
const COLS=['places','schools','businesses','events','news','gallery','announcements','people','services','emergency','projects','festivals','suggestions'];
const PUBLIC=COLS.filter(c=>c!=='suggestions');
const tgReady=()=>!!(process.env.TELEGRAM_BOT_TOKEN&&process.env.TELEGRAM_CHAT_ID);
const adminReady=()=>['ADMIN_PASSWORD_HASH','SESSION_SECRET','TELEGRAM_BOT_TOKEN','TELEGRAM_CHAT_ID'].every(k=>process.env[k]);
const send=(res,s,j)=>{res.statusCode=s;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(j))};

// ---- Telegram: notifications + JSON "database" (latest pinned document) ----
const tg=async(m,body)=>{const r=await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${m}`,body instanceof FormData?{method:'POST',body}:{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});const j=await r.json();if(!j.ok)throw new Error(`telegram ${m}: ${j.description}`);return j.result};
let cache=null,at=0;
async function load(){
 if(cache&&Date.now()-at<20000)return cache;
 const chat=await tg('getChat',{chat_id:process.env.TELEGRAM_CHAT_ID});const doc=chat.pinned_message?.document;let data={};
 if(doc){const f=await tg('getFile',{file_id:doc.file_id});const r=await fetch(`https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${f.file_path}`);data=await r.json()}
 cache=data;at=Date.now();return data}
async function save(data){
 const fd=new FormData();fd.set('chat_id',process.env.TELEGRAM_CHAT_ID);fd.set('disable_notification','true');
 fd.set('document',new Blob([JSON.stringify(data)],{type:'application/json'}),'belanagar-db.json');
 const m=await tg('sendDocument',fd);await tg('pinChatMessage',{chat_id:process.env.TELEGRAM_CHAT_ID,message_id:m.message_id,disable_notification:true});
 cache=data;at=Date.now()}

// ---- auth: scrypt password + HMAC-signed HTTP-only cookie ----
const sign=p=>crypto.createHmac('sha256',process.env.SESSION_SECRET).update(p).digest('base64url');
const mint=()=>{const p=Buffer.from(JSON.stringify({exp:Date.now()+288e5})).toString('base64url');return p+'.'+sign(p)};
const cookie=(v,age)=>`bn_session=${v}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${age}`;
const authed=req=>{const t=(req.headers.cookie||'').split(/;\s*/).find(c=>c.startsWith('bn_session='))?.slice(11);if(!t)return false;
 const[p,s]=t.split('.');if(!p||!s)return false;const e=sign(p);if(e.length!==s.length||!crypto.timingSafeEqual(Buffer.from(e),Buffer.from(s)))return false;
 try{return JSON.parse(Buffer.from(p,'base64url')).exp>Date.now()}catch{return false}};
const okPw=pw=>{const[salt,h]=(process.env.ADMIN_PASSWORD_HASH||'').split(':');if(!salt||!h)return false;const e=Buffer.from(h,'hex');return e.length===64&&crypto.timingSafeEqual(crypto.scryptSync(String(pw??''),salt,64),e)};
const hits=new Map();
const limited=(k,max,win)=>{const n=Date.now(),a=(hits.get(k)||[]).filter(t=>n-t<win);a.push(n);hits.set(k,a);return a.length>max};

// ---- validation / sanitising ----
const URLK=/^(image|cover|photo|poster|website|source_url)$/;
const clean=o=>{const r={};let n=0;
 for(const[k,v]of Object.entries(o||{})){
  if(!/^[a-z_]{1,30}$/.test(k)||k==='id'||++n>30)continue;
  if(typeof v==='boolean'){r[k]=v;continue}
  if(k==='lat'||k==='lng'){const x=Number(v);if(v!==''&&v!=null&&Number.isFinite(x)&&Math.abs(x)<=180)r[k]=x;continue}
  if(typeof v==='number'&&Number.isFinite(v)){r[k]=v;continue}
  if(typeof v!=='string')continue;
  const s=v.replace(/[<>]/g,'').trim().slice(0,4000);
  if(URLK.test(k)&&s&&!/^https:\/\//i.test(s))continue;
  r[k]=s}
 return r};
const today=()=>new Date().toISOString().slice(0,10);
const badPin=x=>(x.lat!=null||x.lng!=null)&&!(x.lat!=null&&x.lng!=null&&inBoundary(x.lat,x.lng));
const visible=(c,x)=>x.published!==false&&(c!=='announcements'||!x.expires||x.expires>=today())&&(c!=='people'||x.consent==='yes');

export default async function handler(req,res){
 const t0=Date.now(),url=new URL(req.url,'http://x');let code=200;
 const out=(s,j)=>{code=s;send(res,s,j)};
 const raw=url.searchParams.get('path')??url.pathname.replace(/^\/api\/?(router\/?)?/,'');
 const[a,b,id]=raw.split('/').filter(Boolean),m=req.method;
 const ip=String(req.headers['x-forwarded-for']||'').split(',')[0].trim()||'unknown';
 try{
  const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
  if(a==='admin'){
   if(b==='login'&&m==='POST'){
    if(!adminReady())return out(503,{error:'setup'});
    if(limited('login:'+ip,5,9e5))return out(429,{error:'rate'});
    if(!okPw(body.password))return out(401,{error:'auth'});
    res.setHeader('Set-Cookie',cookie(mint(),28800));return out(200,{ok:true})}
   if(b==='logout'&&m==='POST'){res.setHeader('Set-Cookie',cookie('',0));return out(200,{ok:true})}
   if(b==='session'&&m==='GET')return out(200,{admin:adminReady()&&authed(req)});
   if(!adminReady())return out(503,{error:'setup'});
   if(!authed(req))return out(401,{error:'auth'});
   if(m!=='GET'&&req.headers['x-requested-with']!=='bn')return out(403,{error:'csrf'});
   const db=await load();
   if(b==='overview')return out(200,Object.fromEntries(COLS.map(k=>[k,(db[k]||[]).length])));
   if(b==='import'&&m==='POST'){
    const keep=Object.fromEntries(Object.entries(db.village||{}).filter(([,x])=>x!==''));
    db.village={...clean(body.village),...keep};let added=0;
    for(const k of COLS){const list=db[k]=db[k]||[];
     for(const raw of Array.isArray(body[k])?body[k]:[]){const it=clean(raw),key=(it.name||it.title||'').toLowerCase();
      if(badPin(it)){delete it.lat;delete it.lng}
      if(!key||list.some(x=>(x.name||x.title||'').toLowerCase()===key))continue;
      list.push({...it,id:crypto.randomUUID()});added++}}
    await save(db);return out(200,{added})}
   if(b==='village'){
    if(m==='GET')return out(200,db.village||{});
    if(m==='PUT'){db.village=clean(body);await save(db);return out(200,db.village)}}
   if(COLS.includes(b)){
    const list=db[b]=db[b]||[];
    if(m==='GET'&&!id)return out(200,list);
    if(m==='POST'&&!id){const it={...clean(body),id:crypto.randomUUID()};if(badPin(it))return out(400,{error:'outside'});list.unshift(it);await save(db);return out(201,it)}
    const i=list.findIndex(x=>x.id===id);if(i<0)return out(404,{error:'notfound'});
    if(m==='PUT'){const it={...clean(body),id};if(badPin(it))return out(400,{error:'outside'});list[i]=it;await save(db);return out(200,it)}
    if(m==='DELETE'){list.splice(i,1);await save(db);return out(200,{ok:true})}}
   return out(404,{error:'notfound'})}
  if(m==='POST'&&(a==='contact'||a==='suggest')){
   if(!tgReady())return out(503,{error:'setup'});
   if(limited('form:'+ip,5,36e5))return out(429,{error:'rate'});
   if(body.hp)return out(200,{ok:true});
   const f=clean(body);
   if(!f.name||f.name.length<2||!f.message||f.message.length<5||!f.contact||f.contact.length<3)return out(400,{error:'invalid'});
   const when=new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'});
   if(a==='suggest'){const db=await load();(db.suggestions=db.suggestions||[]).unshift({id:crypto.randomUUID(),name:f.name,type:f.type||'other',message:f.message,contact:f.contact,created:when});await save(db)}
   await tg('sendMessage',{chat_id:process.env.TELEGRAM_CHAT_ID,text:`${a==='contact'?'New Contact Submission':'New Suggestion ('+(f.type||'other')+')'}\n\nName: ${f.name}\nPhone/Email: ${f.contact}\nSubject: ${f.subject||'-'}\nMessage: ${f.message}\nTime: ${when}`.slice(0,4000)});
   return out(200,{ok:true})}
  if(m==='GET'){
   const db=tgReady()?await load():{};
   if(a==='summary')return out(200,{village:db.village||{},counts:Object.fromEntries(PUBLIC.map(k=>[k,(db[k]||[]).filter(x=>visible(k,x)).length]))});
   if(a==='village')return out(200,db.village||{});
   if(PUBLIC.includes(a))return out(200,(db[a]||[]).filter(x=>visible(a,x)))}
  return out(404,{error:'notfound'})
 }catch(e){console.error('[api]',m,url.pathname,e);if(!res.writableEnded)out(500,{error:'server'})}
 finally{console.log(`[api] ${m} ${a||''}/${b||''} ${code} ${Date.now()-t0}ms`)}
}
