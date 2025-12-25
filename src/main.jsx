import './index.css';
import 'flowbite';

import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';

import { AuthProvider } from "./context/AuthContext";
import App from './App.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
