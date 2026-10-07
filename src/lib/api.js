import {useEffect,useState} from 'react';
import SEED from '../data/seed.js';
export async function api(path,{method='GET',body}={}){
 const r=await fetch('/api/'+path,{method,credentials:'same-origin',headers:{'content-type':'application/json','x-requested-with':'bn'},body:body?JSON.stringify(body):undefined});
 let j=null;try{j=await r.json()}catch{}
 if(!r.ok)throw Object.assign(new Error(j?.error||'server'),{status:r.status});
 return j}
// if the API is unreachable, fall back to the built-in verified starter data
const base=p=>p==='village'?SEED.village:p==='summary'?{village:SEED.village,counts:Object.fromEntries(Object.keys(SEED).filter(k=>Array.isArray(SEED[k])).map(k=>[k,SEED[k].length]))}:Array.isArray(SEED[p])?SEED[p].map((x,i)=>({...x,id:`seed-${p}-${i}`})):undefined;
export function useData(path,fallback){
 const [s,set]=useState({data:fallback,loading:true,error:null});
 useEffect(()=>{let live=true;set(x=>({...x,loading:true,error:null}));
  api(path).then(d=>live&&set({data:d,loading:false,error:null})).catch(e=>{const b=base(path);live&&set(b?{data:b,loading:false,error:null}:{data:fallback,loading:false,error:e})});
  return()=>{live=false}},[path]);
 return s}
