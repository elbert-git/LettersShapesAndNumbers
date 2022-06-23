import addressList from './addressList.json';
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

class AddressMerkleTree{
  constructor(arrayOfAddress){
    // create tree
    this.leafNodes = arrayOfAddress.map(addr => keccak256(addr));
    this.merkleTree = new MerkleTree(this.leafNodes, keccak256, { sortPairs: true});
  }
   
  // get root hash for contract
  getRootHashForContract(){
    const rootHash = this.merkleTree.getRoot();
    const tree = this.merkleTree.toString();
    const firstLine = tree.split('\n')[0];
    const root = firstLine.split(' ')[1];
    return ('0x'+root)
  }
  getRootHash(){
    return this.merkleTree.getRoot();
  }
   
  getAddressProof(address){
    const leaf = keccak256(address);
    const proof = this.merkleTree.getHexProof(leaf);
    return proof;
  }
   
  verify(address){
    const bool = this.merkleTree.verify(this.getAddressProof(address), keccak256(address), this.getRootHash());
    console.log("tree verify: ", bool);
    return bool;
  }
}

export const tree = new AddressMerkleTree(addressList.list);
console.log(tree.getRootHashForContract());