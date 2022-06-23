import React, { useContext, useEffect, useState } from "react";
import InitialLoading from "./components/initialLoading";
import { getWalletObj } from "./module/web3/wallet";
import { getContractObj } from "./module/web3/contract";

// --- create context
export const rootContext = React.createContext();
// create context hook
export function useRootContext(){return useContext(rootContext)};

let wallet;
let contract;


export default function RootContext({children}) {
  // --- states
  const [loading, setLoading] = useState(false);
  const [contractVars, setContractVars] = useState({});
  const [currentWallet, setCurrentWallet] = useState(null);
  // --- context data
  const contextData = {
    currentAddress: null,
    contractVars: contractVars,
    walletModule: wallet,
    walletAddress: currentWallet,
  };
   
  // --- load start up modules before rendering stuff
  useEffect(()=>{
    const load = async function(){
      /// load start up modules
      wallet = await getWalletObj();
      wallet.onWalletConnectionChanged = setCurrentWallet;
      contract = await getContractObj();
      // get contract vars
      contract.onUpdateContractVar = setContractVars;
      await contract.getContractVariables();
      setLoading(true);
    }
    load();
  },[])
   

  return (
    <rootContext.Provider className="App" value={contextData}>
      {loading ? children : <InitialLoading/>}
    </rootContext.Provider>
  );
}

