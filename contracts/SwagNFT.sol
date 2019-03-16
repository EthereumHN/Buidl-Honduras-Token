pragma solidity ^0.5.2;

import '../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';
import '../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol';
import '../node_modules/openzeppelin-solidity/contracts/drafts/Counter.sol';

contract SwagNFT is ERC721Full{
    using Counter for Counter.Counter;
    Counter.Counter private tokenId;

    constructor(
        string memory name,
        string memory symbol
    )
        ERC721Full(name, symbol)
        public
    {}

    function createSwag(
        string memory tokenURI
    )
        public
        returns (bool)
    {
        uint256 swagId = tokenId.next();
        _mint(msg.sender, swagId);
        _setTokenURI(swagId, tokenURI);
        return true;
    }
}
