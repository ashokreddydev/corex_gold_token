// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
//import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title GoldToken
 * @dev ERC-20 token backed by physical gold. 1 token = 1 gram of physical gold.
 * Features:
 * - Only a vault manager can mint new tokens
 * - Users can burn tokens to redeem physical gold
 * - Owner can update vault manager address
 * - Emergency pause/unpause functionality
 * - Full ERC20 compliance with OpenZeppelin standards
 */
contract GoldToken is ERC20, Ownable, Pausable, ERC20Burnable {
    // ============== State Variables ==============

    /// @dev Address of the vault manager who can mint tokens
    address public vaultManager;

    // ============== Events ==============

    /// @dev Emitted when vault manager address is updated
    event VaultManagerUpdated(address indexed previousManager, address indexed newManager);

    /// @dev Emitted when tokens are minted
    event TokenMinted(address indexed to, uint256 amount);

    /// @dev Emitted when tokens are burned
    event TokenBurned(address indexed from, uint256 amount);

    /// @dev Emitted when contract is paused
    event ContractPaused(address indexed by);

    /// @dev Emitted when contract is unpaused
    event ContractUnpaused(address indexed by);

    // ============== Constructor ==============

    /**
     * @dev Initialize the Gold Token contract
     * @param initialVaultManager Address of the initial vault manager
     * @param initialOwner Address of the initial owner
     */
    constructor(
        address initialVaultManager,
        address initialOwner
    ) ERC20("Gold Backed Token", "GBT") Ownable(initialOwner) {
        require(initialVaultManager != address(0), "Vault manager cannot be zero address");
        vaultManager = initialVaultManager;
    }

    // ============== Modifiers ==============

    /// @dev Ensures only the vault manager can call the function
    modifier onlyVault() {
        require(msg.sender == vaultManager, "Only vault manager can call this function");
        _;
    }

    // ============== Vault Manager Functions ==============

    /**
     * @dev Updates the vault manager address (only owner)
     * @param newVaultManager New vault manager address
     */
    function updateVaultManager(address newVaultManager) external onlyOwner {
        require(newVaultManager != address(0), "New vault manager cannot be zero address");
        require(newVaultManager != vaultManager, "New vault manager is same as current");
        
        address previousManager = vaultManager;
        vaultManager = newVaultManager;
        
        emit VaultManagerUpdated(previousManager, newVaultManager);
    }

    // ============== Mint Functions ==============

    /**
     * @dev Mints new GBT tokens (only vault manager)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint (in wei, 18 decimals)
     * 
     * Requirements:
     * - Only vault manager can mint
     * - Recipient cannot be zero address
     * - Amount must be greater than 0
     * - Contract must not be paused
     */
    function mint(address to, uint256 amount) external onlyVault whenNotPaused {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Mint amount must be greater than 0");
        
        _mint(to, amount);
        
        emit TokenMinted(to, amount);
    }

    /**
     * @dev Batch mint tokens to multiple addresses (only vault manager)
     * @param recipients Array of recipient addresses
     * @param amounts Array of amounts to mint (must match recipients length)
     * 
     * Requirements:
     * - Only vault manager can mint
     * - Arrays must have same length
     * - All recipients must be non-zero
     * - All amounts must be greater than 0
     * - Contract must not be paused
     */
    function batchMint(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external onlyVault whenNotPaused {
        require(recipients.length == amounts.length, "Recipients and amounts length mismatch");
        require(recipients.length > 0, "Must provide at least one recipient");
        require(recipients.length <= 100, "Cannot mint to more than 100 recipients at once");

        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Cannot mint to zero address");
            require(amounts[i] > 0, "Mint amount must be greater than 0");
            
            _mint(recipients[i], amounts[i]);
            emit TokenMinted(recipients[i], amounts[i]);
        }
    }

    // ============== Burn Functions ==============

    /**
     * @dev Burns tokens from caller's balance
     * @param amount Amount of tokens to burn (in wei, 18 decimals)
     * 
     * Requirements:
     * - Amount must be greater than 0
     * - Caller must have sufficient balance
     * - Contract must not be paused
     */
    function burn(uint256 amount) public override whenNotPaused {
        require(amount > 0, "Burn amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance to burn");
        
        super.burn(amount);
        emit TokenBurned(msg.sender, amount);
    }

    /**
     * @dev Burns tokens from another address (requires approval)
     * @param account Address to burn tokens from
     * @param amount Amount of tokens to burn (in wei, 18 decimals)
     * 
     * Requirements:
     * - Amount must be greater than 0
     * - Account must have sufficient balance
     * - Caller must have sufficient allowance
     * - Contract must not be paused
     */
    function burnFrom(address account, uint256 amount) public override whenNotPaused {
        require(amount > 0, "Burn amount must be greater than 0");
        require(balanceOf(account) >= amount, "Insufficient balance to burn");
        
        super.burnFrom(account, amount);
        emit TokenBurned(account, amount);
    }

    // ============== Pause Functions ==============

    /**
     * @dev Pauses token transfers and mints (only owner)
     * Emergency function to stop all token movements
     */
    function pause() external onlyOwner {
        _pause();
        emit ContractPaused(msg.sender);
    }

    /**
     * @dev Unpauses token transfers and mints (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
        emit ContractUnpaused(msg.sender);
    }

    // ============== View Functions ==============

    /**
     * @dev Returns the total supply of tokens
     * @return Total supply in wei (18 decimals)
     */
    function totalSupply() public view override returns (uint256) {
        return super.totalSupply();
    }

    /**
     * @dev Returns the token decimals (18)
     * @return Number of decimals
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }

    /**
     * @dev Returns whether the contract is paused
     * @return True if paused, false otherwise
     */
    function isPaused() external view returns (bool) {
        return paused();
    }

    // ============== Internal Functions ==============

    /**
     * @dev Override _update to add pause check for transfers
     */
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override whenNotPaused {
        super._update(from, to, value);
    }
}
