pragma solidity ^0.5.0;

import '../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';
import '../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol';
import '../node_modules/openzeppelin-solidity/contracts/drafts/Counter.sol';
import './SwagStore.sol';

contract SwagNFT is ERC721Full, ERC721Mintable{
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

    function setStoreAddress(
        
        address _storeAddress
    )
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
        _mint(storeAddress, swagId);
        _setTokenURI(swagId, _tokenURI);
        SwagStore(storeAddress).assignToken(swagId, _price);
        return true;
    }

    function createOwnedSwag(
        address _to,
        string memory _tokenURI
    )
        public
        returns (bool)
    {
        uint256 swagId = tokenId.next();
        _mint(_to, swagId);
        _setTokenURI(swagId, _tokenURI);
        return true;
    }

    /// @notice Returns a list of all swag IDs assigned to an address.
    /// @param _owner The owner whose swag we are interested in.
    /// @dev This method MUST NEVER be called by smart contract code. First, it's fairly
    ///  expensive (it walks the entire swag array looking for swag belonging to owner),
    ///  but it also returns a dynamic array, which is only supported for web3 calls, and
    ///  not contract-to-contract calls.
    function tokensOfOwner(address _owner) external view returns(uint256[] memory ownerTokens) {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 totalSwag = totalSupply();
            uint256 resultIndex = 0;

            // We count on the fact that all Swag have IDs starting at 1 and increasing
            // sequentially up to the totalCat count.
            uint256 swagId;

            for (swagId = 1; swagId <= totalSwag; swagId++) {
                if (ownerOf(swagId) == _owner) {
                    result[resultIndex] = swagId;
                    resultIndex++;
                }
            }

            return result;
        }
    }
}
