import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client'

import React from "react";
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
        <BrowserRouter>  {/* ✅ Wrap the app inside BrowserRouter */}
            <App />
        </BrowserRouter>
    </React.StrictMode>
)
