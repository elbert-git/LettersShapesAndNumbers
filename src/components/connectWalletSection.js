import axios from "axios";
import { useEffect, useState } from "react";
import { useRootContext } from "../rootContext";
import { tree } from "../module/merkleTree/merkleTree";



export default function ConnectWallet(){
  const context = useRootContext();
  const contract = context.contractModule;
  const address = context.walletAddress;
  const walletMod = context.walletModule;
  const [whiteListProof, setWhiteListProof] = useState([]);
  const mintsAllowed = 1 - parseInt(contract.contractVariables.userMinted);
  
  useEffect(()=>{
    const getProof = async function(){
      if(address){ // have address
        // get proof
        const proof = tree.getAddressProof(address);
        console.log(proof);
        setWhiteListProof(proof)
        await contract.getUserVariables(address); 
      }
    }
    getProof();
    console.log()
  },[address]);

  const reqMint = function(){
    console.log(whiteListProof);

    contract.mint(
      address,
      whiteListProof
    );
  }
   

  const reqWallet = async function() {console.log('reqWallet'); await walletMod.requestWallet()}
  
  return(
    <div>
      <h1>Connect Wallet</h1>
      <div>Current Wallet is: {address ? address : "unconnected"}</div>
      <button onClick={reqWallet}>Connect Wallet</button>
      <div>Are you part of whiteList?: {whiteListProof.length > 0 ? "yes":"no"}</div>
      <div>Mints Left Allowed: {address ? mintsAllowed : "0"}</div>
      {whiteListProof.length > 0 ? <button onClick={reqMint}>mint</button> : null}
    </div>
  )
}