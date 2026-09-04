import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeDocumentScrollForIntro } from './components/intro/introLifecycle';

// Enforce manual scroll restoration and scroll to (0, 0) at document load
initializeDocumentScrollForIntro();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
