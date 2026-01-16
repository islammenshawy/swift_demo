import React from 'react';
import { createRoot } from 'react-dom/client';
import StandaloneApp from './StandaloneApp';
import './standalone.css';

// Mount the app when the DOM is ready
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <StandaloneApp />
    </React.StrictMode>
  );
}
