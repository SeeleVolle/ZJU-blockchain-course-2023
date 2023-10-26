// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;


// Uncomment this line to use console.log
import "hardhat/console.sol";
import "./MyNFT.sol";
import "./MyERC.sol";

contract BorrowYourCar {

    // use a event if you want
    // to represent time you can choose block.timestamp
    event CarBorrowed(uint256 carTokenId, address borrower, uint256 startTime, uint256 duration);
    event userBalance(uint256 balance);

    address public manager;
    address[] public users;
    MyNFT public nft;
    MyERC public erc20;

    modifier onlyManager {
        require(msg.sender == manager, "Only manager can call this function");
        _;
    }

    constructor() {
        manager = msg.sender;
        nft = new MyNFT("car_NFT", "car_NFT_symbol");
        erc20 = new MyERC("my_ERC20", "my_ERC20_symbol");
    }

    // function mintMoney()  public {
    //     erc20.mint(msg.sender);
    //     // console.log("mintMoney :", erc20.balanceOf(msg.sender));
    // }

    // function mintCar() public {
    //     nft.AwardItem(msg.sender);
    // }
    function setCarPrice(uint256 tokenId, uint256 price) public {
        require(msg.sender == nft.getCarRealOwner(tokenId), "Only Real Owner can set the price");
        nft.setCarPrice(tokenId, price);
    }

    function helloworld() pure external returns(string memory) {
        return "hello world";
    }

    function Getcarnum() public view returns(uint256){
        // console.log("Getcarnum sender:", msg.sender);
        return nft.balanceOf(msg.sender);
    }


    function Getcarlist() public view returns(uint256[] memory){
        uint256 num = Getcarnum();
        uint256[] memory carlist = nft.totalItems();
        uint256[] memory result = new uint256[](num);
        uint256 counter = 0;
        for(uint256 i = 0; i < carlist.length; i++){
            if(nft.ownerOf(carlist[i]) == msg.sender || nft.userof(carlist[i]) == msg.sender){
                result[counter] = carlist[i];
                counter++;
            }
        }
        if(result.length == 0)
            revert ("You don't have any car");
        // console.log("result_length: ", result.length);
        return result;
    }

    function Getfreecarlist() public view returns(uint256[] memory){
        uint256[] memory validcar = new uint256[](nft.totalSupply());
        uint256[] memory carlist = nft.totalItems();
        uint256 freecar_sum = 0;
        for(uint256 i = 0; i < carlist.length; i++){
            if(nft.userof(carlist[i]) == address(0) || nft.userExpires(carlist[i]) == 0){
                validcar[freecar_sum] = carlist[i];
                freecar_sum++;
            }
        }
        uint256[] memory freecarlist = new uint256[](freecar_sum);
        for(uint256 i = 0; i < freecar_sum; i++){
            freecarlist[i] = validcar[i];
        }
        return freecarlist;
    }

    function Getcarowner(uint256 tokenId) public view returns(address){
        return nft.getCarRealOwner(tokenId);
    }

    function Getcarborrower(uint256 tokenId) public view returns(address){
        return nft.userof(tokenId);
    }
    
    function Getcarborrowerexpires(uint256 tokenId) public view returns(uint256){
        return nft.userExpires(tokenId);
    }

    function getCarPrice(uint256 tokenId) public view returns(uint256){
        return nft.getCarPrice(tokenId);
    }

    function getBalanceofUser() public returns(uint256){
        uint256 balance = erc20.balanceOf(msg.sender);
        // console.log("balance: ", balance);
        emit userBalance(erc20.balanceOf(msg.sender));
        return balance;
    }

    function borrowCar(address user, uint256 tokenId, uint256 duration) public returns(uint256){
        // if(nft.userof(tokenId) != address(0) || nft.userExpires(tokenId) != 0)
            // revert("This car is not free");
        require(nft.userof(tokenId) == address(0), "This car is not free");
        require(nft.userExpires(tokenId) == 0, "This car is not free");
        require(erc20.balanceOf(user) >= (nft.getCarPrice(tokenId) * duration), "The user don't have enough money");

        nft.setUser(tokenId, user, duration);
        nft.transfer(tokenId, user);
        
        // erc20.transferFrom(user, address(this),nft.getCarPrice(tokenId) * duration);
        erc20.new_transfer(user, nft.getCarRealOwner(tokenId), nft.getCarPrice(tokenId) * duration);
        emit CarBorrowed(tokenId, msg.sender, block.timestamp, duration);
        uint256 time = block.timestamp;
        return time;
    }


    function returnCar(uint256 tokenId) public returns(bool){
        require(nft.userof(tokenId) == msg.sender || msg.sender == manager, "You are not the borrower or the manager");
        address realOwner = nft.getCarRealOwner(tokenId);
        nft.transfer(tokenId, realOwner);
        nft.setUser(tokenId, address(0), 0);
        return true;
    }

}