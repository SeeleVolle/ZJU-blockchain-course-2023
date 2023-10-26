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
      await borrowYourCar.connect(user1).mintCar();
      await borrowYourCar.connect(user1).mintCar();
      await borrowYourCar.connect(user1).mintCar();
      await borrowYourCar.connect(user2).mintCar();
      await borrowYourCar.connect(user1).mintCar();
      await borrowYourCar.connect(user2).mintCar();
      await borrowYourCar.connect(user3).mintCar();
      await borrowYourCar.connect(user2).mintCar();
      // console.log(user2.address)
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
      expect(await borrowYourCar.connect(user2).Getcarnum()).to.equal(3);
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
      //mint cars
      await borrowYourCar.connect(user1).mintCar();
      await borrowYourCar.connect(user2).mintCar();
      await borrowYourCar.connect(user3).mintCar();
      //mint money
      await borrowYourCar.connect(user1).mintMoney();
      await borrowYourCar.connect(user2).mintMoney();
      await borrowYourCar.connect(user3).mintMoney();

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
      // const get_user1_money = await borrowYourCar.connect(user1).getBalanceofUser();
      // const receipt = await get_user1_money.wait();
      // const user1_money = receipt.events[0].args.balance;
      // console.log("user1_money", user1_money)
      await borrowYourCar.connect(user2).borrowCar(user1.address, user2_cars[0], 600);
      expect(await borrowYourCar.Getcarborrower(user2_cars[0])).to.equal(user1.address);
      await expect(borrowYourCar.connect(user2).borrowCar(user3.address, user2_cars[0], 600)).to.be.revertedWith("This car is not free");
      await borrowYourCar.connect(user1).returnCar(user2_cars[0]);

      await borrowYourCar.connect(user2).borrowCar(user3.address, user2_cars[0], 600);
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

    it("BorrowCarWithPrice", async function() {
      const {borrowYourCar, owner, user1, user2, user3, user1_cars, user2_cars, user3_cars, cars} = await loadFixture(deployFixture_func);

      await borrowYourCar.connect(user1).setCarPrice(user1_cars[0], 1);
      await borrowYourCar.connect(user2).setCarPrice(user2_cars[0], 1);
      await borrowYourCar.connect(user3).setCarPrice(user3_cars[0], 1);

      // const carprice = await borrowYourCar.connect(user1).getCarPrice(user1_cars[0]);
      // console.log("carprice:", carprice);

      await borrowYourCar.connect(user2).borrowCar(user1.address, user2_cars[0], 600);
      expect(await borrowYourCar.Getcarborrower(user2_cars[0])).to.equal(user1.address);
      const get_user1_balance = await borrowYourCar.connect(user1).getBalanceofUser();
      const receipt1 = await get_user1_balance.wait();
      const user1_balance = receipt1.events[0].args.balance;
      const get_user2_balance = await borrowYourCar.connect(user2).getBalanceofUser();
      const receipt2 = await get_user2_balance.wait();
      const user2_balance = receipt2.events[0].args.balance;

      expect(user1_balance).to.equal(9400);
      expect(user2_balance).to.equal(10600);

      await expect(borrowYourCar.connect(user2).borrowCar(user3.address, user2_cars[0], 600)).to.be.revertedWith("This car is not free");
      await borrowYourCar.connect(user1).returnCar(user2_cars[0]);

      await borrowYourCar.connect(user2).borrowCar(user3.address, user2_cars[0], 600)
      expect(await borrowYourCar.Getcarborrower(user2_cars[0])).to.equal(user3.address);
      await borrowYourCar.connect(user3).returnCar(user2_cars[0]);
      
      await borrowYourCar.connect(user2).borrowCar(user1.address, user2_cars[0], 1000);
      await borrowYourCar.connect(user1).returnCar(user2_cars[0]);

      const get_user1_balance_2 = await borrowYourCar.connect(user1).getBalanceofUser();
      const receipt1_2 = await get_user1_balance_2.wait();
      const user1_balance_2 = receipt1_2.events[0].args.balance;
      const get_user2_balance_2 = await borrowYourCar.connect(user2).getBalanceofUser();
      const receipt2_2 = await get_user2_balance_2.wait();
      const user2_balance_2 = receipt2_2.events[0].args.balance;

      expect(user1_balance_2).to.equal(8400);
      expect(user2_balance_2).to.equal(12200);

      await expect(borrowYourCar.connect(user2).borrowCar(user1.address, user2_cars[0], 100000)).to.be.revertedWith("The user don't have enough money");
      
    });

  });

});