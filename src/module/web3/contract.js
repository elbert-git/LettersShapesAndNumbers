import Web3 from 'web3/dist/web3.min';
import secret from '../../secret.json';

// get contract abi
const contractAbi =  require('./contractAbi');
const contractAddress = '0x1a0b59820576E229baEe0291E1a01657fd7bfeD4';

class Contract{
  constructor(){
    //states
    this.initialised = false;
    // vars
    this.web3 = null;
    this.contract = null;
     
    //contract variables
    this.contractVariables = {
      totalSupply : null,
      supplyMinted : null,
      supplyLeft : null,
      whiteListMintsLeft : null
    }
     
    // on update contract
    this.onUpdateContractVar = null;
  }
  async init(provider){
    // init web3
    this.web3 = new Web3(provider);
    // set contract instance
    const contract = await new this.web3.eth.Contract(contractAbi, contractAddress);
    this.contract = contract;
    console.log(contract);
  }
   
  async getContractVariables(){
    const totalSupply = 18;
    const supplyMinted = await this.contract.methods.totalSupply().call();
    const supplyLeft = 18 - supplyMinted;
    const whiteListMintsLeft = supplyLeft - 9 - supplyMinted;
    const obj = {
      totalSupply : 18,
      supplyMinted : supplyMinted,
      supplyLeft : supplyLeft,
      whiteListMintsLeft : whiteListMintsLeft,
      isWhiteListing : whiteListMintsLeft > 0 ? true : false
    }
    if(obj.whiteListMintsLeft < 1){obj.whiteListMintsLeft = 0}
    this.contractVariables = obj;
    if(this.onUpdateContractVar != null){this.onUpdateContractVar(this.contractVariables)}
  }
}

export const getContractObj = async function(){
  // --- get contract class
  const contract = new Contract();
  // --- check if metamask exists
  if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) { // has metmaask continue initialising
    console.log('MetaMask is installed!');
    // init wallet
    await contract.init(window.ethereum);
  }else{ // use infura to initialise
    console.log('metamask not found. using infura');
    await contract.init(secret.rinkeby);
  }
  return contract;
}