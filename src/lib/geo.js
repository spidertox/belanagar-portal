import {BOUNDARY} from '../data/boundary.js';
// true when (lat,lng) lies inside the Belanagar KML boundary
export const inBoundary=(lat,lng)=>{let c=false;
 for(let i=0,j=BOUNDARY.length-1;i<BOUNDARY.length;j=i++){const[y1,x1]=BOUNDARY[i],[y2,x2]=BOUNDARY[j];
  if((y1>lat)!==(y2>lat)&&lng<(x2-x1)*(lat-y1)/(y2-y1)+x1)c=!c}
 return c};
