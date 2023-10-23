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
    error GetCarlistFailed(address sender);

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
        erc20 = new MyERC("my_ERC20", "car_ERC20_symbol");
    }

    function mintCar(address user) onlyManager public {
        nft.AwardItem(user);
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
            if(nft.userof(carlist[i]) == msg.sender || nft.ownerOf(carlist[i]) == msg.sender){
                result[counter] = carlist[i];
                counter++;
            }
        }
        if(result.length == 0)
            revert GetCarlistFailed(msg.sender);
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

    function borrowCar(address user, uint256 tokenId, uint256 duration) public returns(uint256){
        // if(nft.userof(tokenId) != address(0) || nft.userExpires(tokenId) != 0)
            // revert("This car is not free");
        require(nft.userof(tokenId) == address(0), "This car is not free");
        require(nft.userExpires(tokenId) == 0, "This car is not free");
        nft.setUser(tokenId, user, block.timestamp + duration);
        nft.transfer(tokenId, user);
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