pragma solidity ^0.5.0;

import '../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';
import '../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol';
import '../node_modules/openzeppelin-solidity/contracts/drafts/Counter.sol';
import './SwagStore.sol';

contract SwagNFT is ERC721Full{
    using Counter for Counter.Counter;
    Counter.Counter private tokenId;
    address storeAddress;

    constructor(
        string memory _name,
        string memory _symbol,
        address _storeAddress
    )
        ERC721Full(_name, _symbol)
        public
    {
        storeAddress = _storeAddress;
    }

    function createSwag(
        string memory _tokenURI, 
        uint256 _price
    )
        public
        returns (bool)
    {
        uint256 swagId = tokenId.next();
        _mint(msg.sender, swagId);
        _setTokenURI(swagId, _tokenURI);
        SwagStore(storeAddress).assignToken(swagId, _price);
        return true;
    }
}
