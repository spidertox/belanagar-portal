import {useEffect,useState} from 'react';
export async function api(path,{method='GET',body}={}){
 const r=await fetch('/api/'+path,{method,credentials:'same-origin',headers:{'content-type':'application/json','x-requested-with':'bn'},body:body?JSON.stringify(body):undefined});
 let j=null;try{j=await r.json()}catch{}
 if(!r.ok)throw Object.assign(new Error(j?.error||'server'),{status:r.status});
 return j}
export function useData(path,fallback){
 const [s,set]=useState({data:fallback,loading:true,error:null});
 useEffect(()=>{let live=true;set(x=>({...x,loading:true,error:null}));
  api(path).then(d=>live&&set({data:d,loading:false,error:null})).catch(e=>live&&set({data:fallback,loading:false,error:e}));
  return()=>{live=false}},[path]);
 return s}
