import Web3 from 'web3/dist/web3.min';
import secret from '../../secret.json';

// get contract abi
const contractAbi =  require('./contractAbi');
const contractAddress = '0x9D4d4A3695944cC68c796B9044cD3dE9fEebFcaf';

class Contract{
  constructor(){
    //states
    this.initialised = false;
    // vars
    this.web3 = null;
    this.contract = null;
  }
  async init(provider){
    // init web3
    this.web3 = new Web3(provider);
    // set contract instance
    const contract = await new this.web3.eth.Contract(contractAbi, contractAddress);
    this.contract = contract;
    console.log(contract);
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
    await contract.init(secret.mainNet);
  }
  return contract;
}