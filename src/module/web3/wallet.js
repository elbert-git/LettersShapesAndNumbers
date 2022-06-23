import Web3 from 'web3/dist/web3.min';

export class Wallet{
  constructor(){
    // states
    this.initialised = false;
    this.web3 = null
    this.currentAddress = null;
    this.walletConnected = false;
    // on wallet address changed
    this.onWalletConnectionChanged = null;
  }
  async init(provider){
    this.web3 = new Web3(provider);
    // on accounts changed function
    window.ethereum.on('accountsChanged', (wallet)=>{
      // set this object account
      this.currentAddress = wallet[0];
      // call on wallwallet change fucntion
      if(this.onWalletConnectionChanged !== null){
        this.onWalletConnectionChanged(this.currentAddress);
      }
    });
    this.initialised = true;
  }

  async requestWallet(){
    // reach into metamask and ask for wallet
    const address = await window.ethereum.request({method: 'eth_requestAccounts'});
    this.walletConnected = (address[0] != null) ? true : false;
    this.currentAddress = address[0];
    if(this.onWalletStatusChanged !== null){
      this.onWalletConnectionChanged(this.currentAddress);
    }
  }
}

export const getWalletObj = async function(){
  // --- get wallet
  const wallet = new Wallet();
  // --- check if metamask exists
  if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) { // has metmaask continue initialising
    console.log('MetaMask is installed!');
    // init wallet
    await wallet.init(window.ethereum);
  }else{ // do nothing without metamask
    console.log('metamask is not installed');
  }
  return wallet;
}