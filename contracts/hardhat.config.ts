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
        '0x3d10bf90b6e6cf36a300e4885c7d46c56710800008ed325eee770a117b48d349',
        '0xcd56220d3e083039edb2d01062cbda78eebdbccdac9caf48e6c3e762ac3ed1d5',
        '0x3742fb6045bea0d92491a3aae3fce5ab5c5123e54aec0d3b0d5200e3a3cb270d',
        '0x462f8f3b525a62cb6193f9084fa5a8ab822f286c07051e13a7d34d46ddf6cc32',
        '0x871787eb15521351988e5fd9368068d1382eddcae074bbf53a7fb48b490eb21b'
      ]
    },
  },
};

export default config;
