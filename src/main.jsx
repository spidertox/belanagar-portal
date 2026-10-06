import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import {LangProvider} from './i18n/index.jsx';
createRoot(document.getElementById('root')).render(<BrowserRouter><LangProvider><App/></LangProvider></BrowserRouter>);
