import {lazy} from 'react';
import {Routes,Route} from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Section from './pages/Section.jsx';
import {PUBLIC} from './data/sections.js';
import {PageHead} from './components/UI.jsx';
const About=lazy(()=>import('./pages/About.jsx')),MapPage=lazy(()=>import('./pages/MapPage.jsx')),Contact=lazy(()=>import('./pages/Contact.jsx')),Admin=lazy(()=>import('./pages/Admin.jsx'));
export default function App(){return(<Routes><Route element={<Layout/>}>
 <Route index element={<Home/>}/><Route path="about" element={<About/>}/><Route path="map" element={<MapPage/>}/><Route path="contact" element={<Contact/>}/><Route path="admin" element={<Admin/>}/>
 {PUBLIC.map(s=><Route key={s.k} path={s.k} element={<Section k={s.k}/>}/>)}
 <Route path="*" element={<PageHead title="404"/>}/></Route></Routes>)}
