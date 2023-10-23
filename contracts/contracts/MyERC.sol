// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyERC is ERC20{

    mapping(address => bool) claimedUserList;

    constructor(string memory name, string memory symbol)ERC20(name, symbol){

    }
    
    function mint() external{
        require(claimedUserList[msg.sender] == false, "You have already claimed");
        _mint(msg.sender, 10000);
        claimedUserList[msg.sender] == true;
    }

}