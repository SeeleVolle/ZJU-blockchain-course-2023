import Addresses from './contract-address.json';
import BorrowYourCar from './abis/BorrowYourCar.json';
import MyERC from './abis/MyERC.json';
import MyNFT from './abis/MyNFT.json';

const Web3 = require('web3');


// @ts-ignore
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const BorrowYourCarABI = BorrowYourCar.abi;
const BorrowYourCarAddress = Addresses.BorrowYourCar;
const MyERCABI = MyERC.abi;
const MyERCAddress = Addresses.erc20;
const MyNFTABI = MyNFT.abi;
const MyNFTAddress = Addresses.nft;


const borrowyoucarContract = new web3.eth.Contract(
    BorrowYourCarABI,
    BorrowYourCarAddress,
    {
        gas: '50000000',
        gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
    }
);

const erc20Contract  = new web3.eth.Contract(
    MyERCABI,
    MyERCAddress
);

const nftContract  = new web3.eth.Contract(
    MyNFTABI,
    MyNFTAddress
);

export {web3, borrowyoucarContract , erc20Contract , nftContract}


