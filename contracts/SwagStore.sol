pragma solidity ^0.5.0;

import './HondurasCommunityToken.sol';
import './SwagNFT.sol';

contract SwagStore {

    address tokenContract;
     mapping (uint256 => uint256) public swagItems;

    constructor(address _tokenContract) public{
        tokenContract = _tokenContract;
    }

    //gets nft
    //requires that value = nft price
    //transfers nft
    function tokenFallback(
        address _sender,
        uint256 _value,
        string memory _tokenId
    ) public returns (bool) {
        require(msg.sender == tokenContract);
        uint256 price = swagItems[_tokenId];
        require(price != 0);
        require(_value == price);
        //transfer token to sender and remove it from list price
        swagItems[_tokenId] = 0;
        SwagNFT(tokenContract).transferFrom(address(this), msg.sender, _tokenId);
        return true;
    }

    function assignToken(
        uint256 _tokenId, 
        uint256 _price
    ) public {
        require(_price >= 0);
        swagItems[_tokenId] = _price;
    }
}
