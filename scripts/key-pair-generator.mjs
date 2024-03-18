import { ethers } from 'ethers';
// Generate a new random private key

const wallet = ethers.Wallet.createRandom();
console.log(`secret: ${wallet.privateKey}`);
console.log(`address: ${wallet.address}`);
