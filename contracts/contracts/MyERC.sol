// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract MyERC is ERC20{

    mapping(address => bool) claimedUserList;

    constructor(string memory name, string memory symbol)ERC20(name, symbol){

    }

    function mint() external{
        address user = msg.sender;
        require(claimedUserList[user] == false, "You have already claimed");
        _mint(user, 10000);
        // console.log("msg.sender:", msg.sender);
        // console.log("msg.sender balance:", balanceOf(msg.sender));
        claimedUserList[user] == true;
    }

    function new_transfer(address from , address to, uint256 amount) external{
        require(balanceOf(from) >= amount, "You don't have enough balance");
        _transfer(from, to, amount);
    }

}