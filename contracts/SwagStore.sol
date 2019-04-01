pragma solidity ^0.5.0;

import './BuidlHondurasToken.sol';
import './SwagNFT.sol';
import '../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract SwagStore is Ownable{

    event AssignToken(
        uint256 _tokenId,
        uint256 _price
    );

    address public ERC20TokenContract;
    address public NFTTokenContractAddress;
    mapping (uint256 => uint256) public swagItems;

    constructor(address _tokenContract) public{
        ERC20TokenContract = _tokenContract;
    }

    //gets nft
    //requires that value = nft price
    //transfers nft
    function tokenFallback(
        address _sender,
        uint256 _value,
        uint256 _tokenId
    ) public returns (bool) {
        require(msg.sender == ERC20TokenContract, "Contract must be equal to caller");
        uint256 price = swagItems[_tokenId];
        require(price != 0, "price needs to be != 0");
        require(_value == price, "value should equal price");
        //transfer token to sender and remove it from list price
        swagItems[_tokenId] = 0;
        SwagNFT(NFTTokenContractAddress).safeTransferFrom(address(this), _sender, _tokenId); //Removed event call from SafeTransferFrom
        return true;
    }

    function assignToken(
        uint256 _tokenId, 
        uint256 _price
    ) public {
        require(_price >= 0);
        swagItems[_tokenId] = _price;
        emit AssignToken(_tokenId, _price);
    }

    function setNFTAddress(address _NFTTokenContractAddress) public onlyOwner {
        NFTTokenContractAddress = _NFTTokenContractAddress;
    }
}
