import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Test", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
   async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, user1, user2, user3] = await ethers.getSigners();
    const BorrowYourCar = await ethers.getContractFactory("BorrowYourCar");
    const borrowYourCar = await BorrowYourCar.deploy();
    await borrowYourCar.deployed();
    return {borrowYourCar, owner, user1, user2, user3};
  }

  describe("Deployment", function () {
    it("Should return hello world", async function () {
      const {borrowYourCar} = await loadFixture(deployFixture);
      expect(await borrowYourCar.helloworld()).to.equal("hello world");
    });
  });

  describe("Minting", function () {
    it("Should mint", async function () {
      const {borrowYourCar, owner, user1, user2, user3} = await loadFixture(deployFixture);
      await borrowYourCar.connect(owner).mintCar(user1.address);
      await borrowYourCar.connect(owner).mintCar(user1.address);
      await borrowYourCar.connect(owner).mintCar(user1.address);
      await borrowYourCar.connect(owner).mintCar(user2.address);
      await borrowYourCar.connect(owner).mintCar(user1.address);
      await borrowYourCar.connect(owner).mintCar(user2.address);
      await borrowYourCar.connect(owner).mintCar(user3.address);
      const user1_cars = await borrowYourCar.connect(user1).Getcarlist();
      const user2_cars = await borrowYourCar.connect(user2).Getcarlist();
      const user3_cars = await borrowYourCar.connect(user3).Getcarlist();
      // console.log("car_num_1:", carnum_1);
      // console.log("car_num_2:", carnum_2);
      // const car_2 =  await borrowYourCar.connect(user2).Getcarlist();
      // const free_car = await borrowYourCar.connect(user1).Getfreecarlist();
      // const car_owner = await borrowYourCar.Getcarowner(4);
      // console.log("car_2:", car_2)
      // console.log("car_owner:", car_owner)
      // console.log("user2:", user2.address)
      // console.log("free_car:", free_car)
      // await borrowYourCar.connect(user2).borrowCar(user1.address, user2_cars[0], 600);
      // await borrowYourCar.connect(user1).returnCar(user2_cars[0]);
      // expect(await borrowYourCar.connect(user1).Getcarborrower(user2_cars[0])).to.equal(user1.address);
      // expect(await borrowYourCar.connect(user1).Getcarborrowerexpires(user2_cars[0])).to.equal();
      // expect(await borrowYourCar.connect(user1).Getcarlist()).to.equal(car_1);
      expect(await borrowYourCar.connect(user1).Getcarnum()).to.equal(4);
      expect(await borrowYourCar.connect(user2).Getcarnum()).to.equal(2);
      expect(await borrowYourCar.connect(user3).Getcarnum()).to.equal(1);
    });
  });

  describe("Functionality Test", function() {

    async function deployFixture_func() {
      // Contracts are deployed using the first signer/account by default
      const [owner, user1, user2, user3] = await ethers.getSigners();
      const BorrowYourCar = await ethers.getContractFactory("BorrowYourCar");
      const borrowYourCar = await BorrowYourCar.deploy();
      await borrowYourCar.deployed();

      await borrowYourCar.connect(owner).mintCar(user1.address);
      await borrowYourCar.connect(owner).mintCar(user2.address);
      await borrowYourCar.connect(owner).mintCar(user3.address);
      const user1_cars = await borrowYourCar.connect(user1).Getcarlist();
      const user2_cars = await borrowYourCar.connect(user2).Getcarlist();
      const user3_cars = await borrowYourCar.connect(user3).Getcarlist();
      const cars = [...user1_cars, ...user2_cars, ...user3_cars];
      const free_cars = [...user1_cars, ...user2_cars];
     
      return {borrowYourCar, owner, user1, user2, user3,
              user1_cars, user2_cars, user3_cars, cars, free_cars};
   }


    it("QueryOwnedCar", async function() {
      const {borrowYourCar, owner, user1, user2, user3, user1_cars, user2_cars, user3_cars, cars} = await loadFixture(deployFixture_func);
      const Test_cars = await borrowYourCar.connect(user1).Getcarlist()
      const cars_1 = [1] 
      for(let i = 0; i < Test_cars.length; i++) {
        expect(Test_cars[i]).to.equal(cars[i]);
      }
      expect(await borrowYourCar.connect(user1).Getcarowner(user1_cars[0])).to.equal(user1.address);
    });

    it("BorrowCar", async function() {
      const {borrowYourCar, owner, user1, user2, user3, user1_cars, user2_cars, user3_cars, cars} = await loadFixture(deployFixture_func);
      
      await borrowYourCar.connect(user2).borrowCar(user1.address, user2_cars[0], 600);
      expect(await borrowYourCar.Getcarborrower(user2_cars[0])).to.equal(user1.address);
      await expect(borrowYourCar.connect(user2).borrowCar(user3.address, user2_cars[0], 600)).to.be.revertedWith("This car is not free");
      await borrowYourCar.connect(user1).returnCar(user2_cars[0]);

      await borrowYourCar.connect(user2).borrowCar(user3.address, user2_cars[0], 600)
      expect(await borrowYourCar.Getcarborrower(user2_cars[0])).to.equal(user3.address);
      await borrowYourCar.connect(user3).returnCar(user2_cars[0]);

    });

    it("QueryFreeCar", async function() {
      const {borrowYourCar, owner, user1, user2, user3, user1_cars, user2_cars, user3_cars, cars, free_cars} = await loadFixture(deployFixture_func);
      await borrowYourCar.connect(user3).borrowCar(user1.address, user3_cars[0], 600);
      const Test_free_cars = await borrowYourCar.connect(user1).Getfreecarlist();
      // console.log("Test_free_cars:", Test_free_cars);
      expect(Test_free_cars.length).to.equal(free_cars.length);
      for(let i = 0; i < Test_free_cars.length; i++) {
        expect(Test_free_cars[i]).to.equal(free_cars[i]);
      }
    });

  });

});