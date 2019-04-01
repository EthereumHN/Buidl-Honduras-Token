pragma solidity ^0.5.0;

import '../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import '../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol';
import '../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol';
import '../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol';
import './SwagStore.sol';

contract BuidlHondurasToken is ERC20, ERC20Detailed, ERC20Mintable, ERC20Burnable {

    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals
    )
        ERC20Burnable()
        ERC20Mintable()
        ERC20Detailed(name, symbol, decimals)
        ERC20()
        public
    {}

    //Receives money and buys swag nft
    function transferAndCall(
        address _recipient,
        uint256 _value,
        uint256 _tokenId
    ) public {
            transfer(_recipient, _value);
            require(SwagStore(_recipient).tokenFallback(msg.sender,
                                                        _value,
                                                        _tokenId), "NFT Transfer must be sucessful");
    }

}
