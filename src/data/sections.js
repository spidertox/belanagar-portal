export const SECTIONS=[
{k:'places',hi:'स्थान',en:'Places',f:['name','category','description','address','contact','lat','lng','source']},
{k:'schools',hi:'शिक्षा',en:'Education',f:['name','type','address','contact','website','lat','lng','source']},
{k:'festivals',hi:'संस्कृति',en:'Culture',f:['name','description','tradition','dates','committee','venue','image','website','source']},
{k:'people',hi:'लोग',en:'People',f:['name','category','profession','achievement','bio','photo','consent']},
{k:'businesses',hi:'व्यवसाय',en:'Businesses',f:['name','category','description','phone','hours','address','lat','lng']},
{k:'news',hi:'समाचार',en:'News',f:['title','date','category','cover','summary','body']},
{k:'events',hi:'कार्यक्रम',en:'Events',f:['title','date','time','venue','organizer','description','poster','lat','lng']},
{k:'gallery',hi:'गैलरी',en:'Gallery',f:['caption','image','category','date']},
{k:'announcements',hi:'सूचनाएँ',en:'Announcements',f:['title','body','priority','date','expires']},
{k:'services',hi:'सेवाएँ',en:'Services',f:['name','category','description','contact','address','source_url','source']},
{k:'emergency',hi:'आपातकालीन संपर्क',en:'Emergency',f:['name','phone','note']},
{k:'projects',hi:'विकास कार्य',en:'Development',f:['name','status','date','description','authority','source']},
{k:'suggestions',hi:'सुझाव',en:'Suggestions',admin:true,f:['name','type','message','contact','created']}];
export const PUBLIC=SECTIONS.filter(s=>!s.admin);
export const sec=k=>SECTIONS.find(s=>s.k===k);
export const NAV=['places','schools','festivals','people','businesses','news','events','gallery'];
export const VILLAGE=['name','panchayat','block','district','state','country','pin','police_station','railway','town','area','elevation','lat','lng','population','male','female','households','literacy','languages','timezone','intro','source','last_updated'];
export const SELECT={'places.category':['education','religious','health','business','government','emergency','event','heritage','infrastructure'],'projects.status':['planned','ongoing','completed'],'announcements.priority':['normal','important','urgent'],'people.consent':['yes']};
