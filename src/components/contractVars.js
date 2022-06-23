import { useRootContext } from "../rootContext"


export default function ContractVars(){
  const context = useRootContext().contractVars;
  
  return(
    <div>
      <h1>Contract Variables</h1>
      <div>Total Supply Allowed in Contract: {context.totalSupply}</div>
      <div>Supply Minted: {context.supplyMinted}</div>
      <div>Supply Left: {context.supplyLeft}</div>
      <div>is in white-listing mode: {context.isWhiteListing.toString()}</div>
      <div>White-listed mints left to mint for everyone: {context.whiteListMintsLeft}</div>
    </div>
  )
}