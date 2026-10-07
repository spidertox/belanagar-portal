import {useMemo} from 'react';
import {useData} from './api.js';
import {inBoundary} from './geo.js';
const ok=x=>Number.isFinite(x.lat)&&Number.isFinite(x.lng)&&inBoundary(x.lat,x.lng);
// items = places + schools + businesses; all = items + events that have a venue pin; pinned = those pinned inside the KML boundary
export function useAllPlaces(){
 const P=useData('places',[]),S=useData('schools',[]),B=useData('businesses',[]),E=useData('events',[]);
 return useMemo(()=>{
  const items=[...P.data.map(x=>({...x,c:x.category||''})),...S.data.map(x=>({...x,c:'education'})),...B.data.map(x=>({...x,c:'business'}))];
  const all=[...items,...E.data.filter(x=>x.lat!=null&&x.lng!=null).map(x=>({...x,c:'event',address:x.venue}))];
  return {items,all,pinned:all.filter(ok),loading:P.loading||S.loading||B.loading||E.loading,error:P.error||S.error||B.error||E.error}
 },[P.data,S.data,B.data,E.data,P.loading,S.loading,B.loading,E.loading,P.error,S.error,B.error,E.error])}
