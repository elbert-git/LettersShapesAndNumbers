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
  // --- context data
  const contextData = {data: null};
   
  // --- load start up modules before rendering stuff
  useEffect(()=>{
    const load = async function(){
      /// load start up modules
      wallet = await getWalletObj();
      contract = await getContractObj();
      setLoading(true);
    }
    load();
  },[])
   

  return (
    <div className="App" value={contextData}>
      {loading ? children : <InitialLoading/>}
    </div>
  );
}

