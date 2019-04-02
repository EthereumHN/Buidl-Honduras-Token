pragma solidity ^0.5.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "../node_modules/openzeppelin-solidity/contracts/math/Math.sol";

contract OldTokenMigrator {
    using SafeERC20 for IERC20;

    /// Address of the old token contract
    IERC20 private _legacyToken;

    /// Address of the new token contract
    ERC20Mintable private _newToken;

    /**
     * @param legacyToken address of the old token contract
     */
    constructor (IERC20 legacyToken) public {
        require(address(legacyToken) != address(0));
        _legacyToken = legacyToken;
    }

    /**
     * @dev Returns the legacy token that is being migrated.
     */
    function legacyToken() public view returns (IERC20) {
        return _legacyToken;
    }

    /**
     * @dev Returns the new token to which we are migrating.
     */
    function newToken() public view returns (IERC20) {
        return _newToken;
    }

    /**
     * @dev Begins the migration by setting which is the new token that will be
     * minted. This contract must be a minter for the new token.
     * @param newToken the token that will be minted
     */
    function beginMigration(ERC20Mintable newToken) public {
        require(address(_newToken) == address(0), "address is not empty");
        require(address(newToken) != address(0), "new token is empty");
        require(newToken.isMinter(address(this)), "new token is not minter");

        _newToken = newToken;
    }

    /**
     * @dev Transfers part of an account's balance in the old token to this
     * contract, and mints the same amount of new tokens for that account.
     * @param account whose tokens will be migrated
     * @param amount amount of tokens to be migrated
     */
    function migrate(address account, uint256 amount) public {
        _legacyToken.safeTransferFrom(account, address(this), amount);
        _newToken.mint(account, amount);
    }

    /**
     * @dev Transfers all of an account's allowed balance in the old token to
     * this contract, and mints the same amount of new tokens for that account.
     * @param account whose tokens will be migrated
     */
    function migrateAll(address account) public {
        uint256 balance = _legacyToken.balanceOf(account);
        uint256 allowance = _legacyToken.allowance(account, address(this));
        uint256 amount = Math.min(balance, allowance);
        migrate(account, amount);
    }
}
