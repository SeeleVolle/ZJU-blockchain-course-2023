import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      // rpc url, change it according to your ganache configuration
      url: 'http://127.0.0.1:8545',
      // the private key of signers, change it according to your ganache user
      accounts: [
        '0x5b9304ea6bbb40ab918bb3756b682856afddc39d15ee68e6e2ead784782b8544',
        '0x534c1e36f3a651a102be8fd56334f68d9d83788c736ed3f9f2eb25248fbf434e',
        '0xe23a65afe82d52b0bd53ba14ef2171bb048d6f6e395b53dca9bf409647ad3307',
      ]
    },
  },
};

export default config;
