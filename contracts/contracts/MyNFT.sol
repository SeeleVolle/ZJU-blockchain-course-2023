// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./MyERC.sol";
import "hardhat/console.sol";

contract MyNFT is ERC721 {
    uint256 private _tokenIds;

    event UpdateUser(uint256 indexed tokenId, address indexed user, uint256 expires);

    mapping(uint256 => CarInfo) Cars; // A map from tokenID to Cars
    mapping(address => bool) Initial_Mint_Cliamed;

    struct CarInfo{
        address owner;
        address user;
        uint256 expires;
    }
    
    constructor(string memory name, string memory symbol) ERC721(name, symbol){
        _tokenIds = 0;
    }


    function _isApprovedOrOwner(address caller, uint256 tokenId) internal view virtual returns (bool) {
        require(_requireOwned(tokenId) != address(0), "ERC721: operator query for nonexistent token");
        address owner = ownerOf(tokenId);
        return (caller == owner || getApproved(tokenId) == caller || isApprovedForAll(owner, caller));
    }

    // Mint a new NFT to the user
    function AwardItem(address user) public virtual{
        _tokenIds += 1;
        uint256 newItemId = _tokenIds;
        _mint(user, newItemId);
        CarInfo storage info = Cars[newItemId];
        info.owner = user;
        info.user = address(0);
        info.expires = 0;
    }

    //Set the user and expires of an NFT
    function setUser(uint256 tokenId, address user, uint256 expires) public {
        CarInfo storage info = Cars[tokenId];
        info.user = user;
        info.expires = expires;
        emit UpdateUser(tokenId, user, expires);
    }


    function getCarRealOwner(uint256 tokenId) public view returns(address){
        return Cars[tokenId].owner;
    }

    //Get the user address of the NFT
    function userof(uint256 tokenId) public view returns(address){
        if(Cars[tokenId].expires <= block.timestamp){
            return address(0);
        }
        else {
            return Cars[tokenId].user;
        }
    }

    //Get the user expires of the NFT
    function userExpires(uint256 tokenId) public view returns(uint256){
        return Cars[tokenId].expires;
    }


    function userCarNum() view public returns(uint256) {
        uint256 result = 0;
        for(uint256 i = 1; i <= _tokenIds; i++){
            if(userof(i) == msg.sender){
                result += 1;
            }
        }
        return result;
    }

    function totalItems() public view returns(uint256[] memory){
        uint256[] memory result = new uint256[](_tokenIds);
        uint256 counter = 0;
        for(uint256 i = 1; i <= _tokenIds; i++){
            result[counter] = i;
            counter++;
        }
        return result;
    }

    function totalSupply() public view returns(uint256){
        return _tokenIds;
    }

    function transfer(uint256 tokenID, address user) public{
        // require(msg.sender == ownerOf(tokenID), "Only Owner can approve the user for Car");
        _transfer(super.ownerOf(tokenID), user, tokenID);
    }


    function helloworld() pure external returns(string memory) {
        return "hello world";
    }
}