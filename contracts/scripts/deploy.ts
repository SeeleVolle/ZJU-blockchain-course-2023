import { ethers } from "hardhat";

async function main() {
  const BorrowYourCar = await ethers.getContractFactory("BorrowYourCar");
  const borrowYourCar = await BorrowYourCar.deploy();
  await borrowYourCar.deployed();
  console.log(`BorrowYourCar deployed to ${borrowYourCar.address}`);

  const erc20 = await borrowYourCar.erc20();
  console.log(`erc20 deployed to ${erc20}`);

  const mynft = await borrowYourCar.nft();
  console.log(`nft deployed to ${mynft}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});