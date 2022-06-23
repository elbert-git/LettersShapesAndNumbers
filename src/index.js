import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import RootContext from './rootContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RootContext>
      <h1>'ellow m8</h1>
    </RootContext>
  </React.StrictMode>
);
