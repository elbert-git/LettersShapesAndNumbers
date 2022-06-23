import axios from "axios";
import { useEffect } from "react";
import { useRootContext } from "../rootContext";



export default function ConnectWallet(){
  const context = useRootContext();
  const address = context.walletAddress;
  const walletMod = context.walletModule;
  
  useEffect(()=>{
    const getProof = async function(){
      if(address){ // have address
        const proof =  fetch('https://us-central1-lettersnumbersand-1098b.cloudfunctions.net/getProof?address=' + address);
        console.log(proof);
      }
    }
    getProof();
  },[address]);

  const reqWallet = async function() {console.log('reqWallet'); await walletMod.requestWallet()}
  
  return(
    <div>
      <h1>Connect Wallet</h1>
      <div>Current Wallet is: {address ? address : "unconnected"}</div>
      <button onClick={reqWallet}>Connect Wallet</button>
    </div>
  )
}