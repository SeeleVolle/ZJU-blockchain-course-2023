import Addresses from './contract-address.json';
import BorrowYourCar from './abis/BorrowYourCar.json';
import MyERC from './abis/MyERC.json';
import MyNFT from './abis/MyNFT.json';

const Web3 = require('web3');


// @ts-ignore
let web3 = new Web3(window.Web3.currentProvider);
