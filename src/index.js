import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import RootContext from './rootContext';
import ContractVars from './components/contractVars';
import ConnectWallet from './components/connectWalletSection';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RootContext>
      <ContractVars></ContractVars>
      <ConnectWallet></ConnectWallet>
    </RootContext>
  </React.StrictMode>
);
