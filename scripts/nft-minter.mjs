import { Contract, JsonRpcProvider, Wallet } from 'ethers';

const serverResponse = {
  signature:
    '0x251e48fc4b2ce8c9ee559b46953215ad4bd8212551da2d8bac64e1b478d5f83306c4374fc0890a9d3fc1d9ee3a903452a717e6267e2c1ef8290b4e5015766d061b',
  message: 'verify 1710794208790',
  contractAddress: '0x278A58826EF41e6A3c8Ccfb522bc2139B5b04F4d',
};

const contractAbi = ['function mint(string __message, bytes __signature)'];

const provider = new JsonRpcProvider('https://bsc-testnet-rpc.publicnode.com');

const contract = new Contract(
  serverResponse.contractAddress,
  contractAbi,
  provider,
);

// you can use the kye-pair-generator.js to generate a new key pair
// Don't forget to send som tBNB to the address
const signer = new Wallet(
  // address: 0xC30897cB8227887C60D14D8B96cd1CcAeCaFeaad
  '0x63c461fdb22eb0011d81339362de23c38c563dfe32553bf5aee26cddbd9c3b9f',
).connect(provider);

/*
For the web environment, signer is received from the user's wallet. E.g.:
const signer = provider.getSigner();
Where provider is an instance of ethers.providers.Web3Provider. (e.g. injected by MetaMask or WalletConnect)
 */

const contractWithSigner = contract.connect(signer);

const res = await contractWithSigner.mint(
  serverResponse.message,
  serverResponse.signature,
);

console.log(`NFT mint result:`, res);
