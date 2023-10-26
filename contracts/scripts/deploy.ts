import { ethers } from "hardhat";

async function main() {
  // const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
  // const userWallets = [
  //   new ethers.Wallet("0x3d10bf90b6e6cf36a300e4885c7d46c56710800008ed325eee770a117b48d349", provider), // 用户1的私钥
  //   new ethers.Wallet("0xcd56220d3e083039edb2d01062cbda78eebdbccdac9caf48e6c3e762ac3ed1d5", provider), // 用户2的私钥
  // ];

  const BorrowYourCar = await ethers.getContractFactory("BorrowYourCar");
  const borrowYourCar = await BorrowYourCar.deploy();
  await borrowYourCar.deployed();
  console.log(`BorrowYourCar deployed to ${borrowYourCar.address}`);

  const erc20 = await borrowYourCar.erc20();
  console.log(`erc20 deployed to ${erc20}`);

  const mynft = await borrowYourCar.nft();
  console.log(`nft deployed to ${mynft}`);

  // borrowYourCar.connect(userWallets[0]).mintCar();
  // borrowYourCar.connect(userWallets[1]).mintCar();

  // console.log("user1 mint car");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});