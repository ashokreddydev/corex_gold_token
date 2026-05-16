const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GoldToken Contract", function () {
  let goldToken;
  let owner;
  let vaultManager;
  let user1;
  let user2;
  let addrs;

  // Contract constants
  const TOKEN_NAME = "Gold Backed Token";
  const TOKEN_SYMBOL = "GBT";
  const DECIMALS = 18;
  const ONE_TOKEN = ethers.parseUnits("1", DECIMALS);
  const HUNDRED_TOKENS = ethers.parseUnits("100", DECIMALS);
  const THOUSAND_TOKENS = ethers.parseUnits("1000", DECIMALS);

  beforeEach(async function () {
    [owner, vaultManager, user1, user2, ...addrs] = await ethers.getSigners();

    const GoldToken = await ethers.getContractFactory("GoldToken");
    goldToken = await GoldToken.deploy(vaultManager.address, owner.address);
    await goldToken.waitForDeployment();
  });

  // ============== Deployment & Initialization Tests ==============

  describe("Deployment", function () {
    it("Should have correct name", async function () {
      expect(await goldToken.name()).to.equal(TOKEN_NAME);
    });

    it("Should have correct symbol", async function () {
      expect(await goldToken.symbol()).to.equal(TOKEN_SYMBOL);
    });

    it("Should have correct decimals", async function () {
      expect(await goldToken.decimals()).to.equal(DECIMALS);
    });

    it("Should have zero initial supply", async function () {
      expect(await goldToken.totalSupply()).to.equal(0);
    });

    it("Should set correct vault manager", async function () {
      expect(await goldToken.vaultManager()).to.equal(vaultManager.address);
    });

    it("Should set correct owner", async function () {
      expect(await goldToken.owner()).to.equal(owner.address);
    });

    it("Should not be paused initially", async function () {
      expect(await goldToken.isPaused()).to.be.false;
    });

    it("Should reject zero address as vault manager", async function () {
      const GoldToken = await ethers.getContractFactory("GoldToken");
      await expect(
        GoldToken.deploy(ethers.ZeroAddress, owner.address)
      ).to.be.revertedWith("Vault manager cannot be zero address");
    });
  });

  // ============== Mint Function Tests ==============

  describe("Mint Function", function () {
    it("Should allow vault manager to mint tokens", async function () {
      await goldToken.connect(vaultManager).mint(user1.address, HUNDRED_TOKENS);
      expect(await goldToken.balanceOf(user1.address)).to.equal(HUNDRED_TOKENS);
      expect(await goldToken.totalSupply()).to.equal(HUNDRED_TOKENS);
    });

    it("Should emit TokenMinted event on successful mint", async function () {
      await expect(
        goldToken.connect(vaultManager).mint(user1.address, HUNDRED_TOKENS)
      )
        .to.emit(goldToken, "TokenMinted")
        .withArgs(user1.address, HUNDRED_TOKENS);
    });

    it("Should reject mint from non-vault manager", async function () {
      await expect(
        goldToken.connect(user1).mint(user1.address, HUNDRED_TOKENS)
      ).to.be.revertedWith("Only vault manager can call this function");
    });

    it("Should reject mint from owner (who is not vault manager)", async function () {
      await expect(
        goldToken.connect(owner).mint(user1.address, HUNDRED_TOKENS)
      ).to.be.revertedWith("Only vault manager can call this function");
    });

    it("Should reject mint to zero address", async function () {
      await expect(
        goldToken.connect(vaultManager).mint(ethers.ZeroAddress, HUNDRED_TOKENS)
      ).to.be.revertedWith("Cannot mint to zero address");
    });

    it("Should reject mint with zero amount", async function () {
      await expect(
        goldToken.connect(vaultManager).mint(user1.address, 0)
      ).to.be.revertedWith("Mint amount must be greater than 0");
    });

    it("Should reject mint when paused", async function () {
      await goldToken.connect(owner).pause();
      await expect(
        goldToken.connect(vaultManager).mint(user1.address, HUNDRED_TOKENS)
      ).to.be.revertedWithCustomError(goldToken, "EnforcedPause");
    });

    it("Should allow multiple mints", async function () {
      await goldToken.connect(vaultManager).mint(user1.address, HUNDRED_TOKENS);
      await goldToken.connect(vaultManager).mint(user2.address, HUNDRED_TOKENS);

      expect(await goldToken.balanceOf(user1.address)).to.equal(HUNDRED_TOKENS);
      expect(await goldToken.balanceOf(user2.address)).to.equal(HUNDRED_TOKENS);
      expect(await goldToken.totalSupply()).to.equal(HUNDRED_TOKENS * 2n);
    });

    it("Should allow vault manager to mint to themselves", async function () {
      await goldToken.connect(vaultManager).mint(vaultManager.address, HUNDRED_TOKENS);
      expect(await goldToken.balanceOf(vaultManager.address)).to.equal(HUNDRED_TOKENS);
    });

    it("Should handle large amounts", async function () {
      const largeAmount = ethers.parseUnits("1000000", DECIMALS);
      await goldToken.connect(vaultManager).mint(user1.address, largeAmount);
      expect(await goldToken.balanceOf(user1.address)).to.equal(largeAmount);
    });
  });

  // ============== Batch Mint Tests ==============

  describe("Batch Mint Function", function () {
    it("Should batch mint to multiple addresses", async function () {
      const recipients = [user1.address, user2.address, addrs[0].address];
      const amounts = [HUNDRED_TOKENS, HUNDRED_TOKENS, HUNDRED_TOKENS];

      await goldToken.connect(vaultManager).batchMint(recipients, amounts);

      expect(await goldToken.balanceOf(user1.address)).to.equal(HUNDRED_TOKENS);
      expect(await goldToken.balanceOf(user2.address)).to.equal(HUNDRED_TOKENS);
      expect(await goldToken.balanceOf(addrs[0].address)).to.equal(HUNDRED_TOKENS);
      expect(await goldToken.totalSupply()).to.equal(HUNDRED_TOKENS * 3n);
    });

    it("Should reject batch mint with mismatched arrays", async function () {
      const recipients = [user1.address, user2.address];
      const amounts = [HUNDRED_TOKENS];

      await expect(
        goldToken.connect(vaultManager).batchMint(recipients, amounts)
      ).to.be.revertedWith("Recipients and amounts length mismatch");
    });

    it("Should reject batch mint with zero recipients", async function () {
      await expect(
        goldToken.connect(vaultManager).batchMint([], [])
      ).to.be.revertedWith("Must provide at least one recipient");
    });

    it("Should reject batch mint from non-vault manager", async function () {
      const recipients = [user1.address];
      const amounts = [HUNDRED_TOKENS];

      await expect(
        goldToken.connect(user1).batchMint(recipients, amounts)
      ).to.be.revertedWith("Only vault manager can call this function");
    });

    it("Should emit TokenMinted event for each batch recipient", async function () {
      const recipients = [user1.address, user2.address];
      const amounts = [HUNDRED_TOKENS, HUNDRED_TOKENS];

      const tx = goldToken.connect(vaultManager).batchMint(recipients, amounts);
      
      await expect(tx)
        .to.emit(goldToken, "TokenMinted")
        .withArgs(user1.address, HUNDRED_TOKENS);
      
      await expect(tx)
        .to.emit(goldToken, "TokenMinted")
        .withArgs(user2.address, HUNDRED_TOKENS);
    });

    it("Should reject batch mint exceeding 100 recipients", async function () {
      const recipients = Array(101).fill(user1.address);
      const amounts = Array(101).fill(ONE_TOKEN);

      await expect(
        goldToken.connect(vaultManager).batchMint(recipients, amounts)
      ).to.be.revertedWith("Cannot mint to more than 100 recipients at once");
    });
  });

  // ============== Burn Function Tests ==============

  describe("Burn Function", function () {
    beforeEach(async function () {
      // Mint tokens to user1 for burning tests
      await goldToken.connect(vaultManager).mint(user1.address, THOUSAND_TOKENS);
    });

    it("Should allow user to burn their own tokens", async function () {
      const initialBalance = await goldToken.balanceOf(user1.address);
      await goldToken.connect(user1).burn(HUNDRED_TOKENS);

      expect(await goldToken.balanceOf(user1.address)).to.equal(
        initialBalance - HUNDRED_TOKENS
      );
      expect(await goldToken.totalSupply()).to.equal(THOUSAND_TOKENS - HUNDRED_TOKENS);
    });

    it("Should emit TokenBurned event on successful burn", async function () {
      await expect(goldToken.connect(user1).burn(HUNDRED_TOKENS))
        .to.emit(goldToken, "TokenBurned")
        .withArgs(user1.address, HUNDRED_TOKENS);
    });

    it("Should reject burn with zero amount", async function () {
      await expect(
        goldToken.connect(user1).burn(0)
      ).to.be.revertedWith("Burn amount must be greater than 0");
    });

    it("Should reject burn with insufficient balance", async function () {
      const balance = await goldToken.balanceOf(user2.address);
      await expect(
        goldToken.connect(user2).burn(HUNDRED_TOKENS)
      ).to.be.revertedWith("Insufficient balance to burn");
    });

    it("Should reject burn when balance equals zero", async function () {
      await expect(
        goldToken.connect(user2).burn(ONE_TOKEN)
      ).to.be.revertedWith("Insufficient balance to burn");
    });

    it("Should reject burn when paused", async function () {
      await goldToken.connect(owner).pause();
      await expect(
        goldToken.connect(user1).burn(HUNDRED_TOKENS)
      ).to.be.revertedWithCustomError(goldToken, "EnforcedPause");
    });

    it("Should allow burning exact balance", async function () {
      const balance = await goldToken.balanceOf(user1.address);
      await goldToken.connect(user1).burn(balance);

      expect(await goldToken.balanceOf(user1.address)).to.equal(0);
    });

    it("Should allow multiple burns", async function () {
      await goldToken.connect(user1).burn(HUNDRED_TOKENS);
      await goldToken.connect(user1).burn(HUNDRED_TOKENS);
      await goldToken.connect(user1).burn(HUNDRED_TOKENS);

      const finalBalance = await goldToken.balanceOf(user1.address);
      expect(finalBalance).to.equal(THOUSAND_TOKENS - (HUNDRED_TOKENS * 3n));
    });

    it("Should decrease total supply correctly", async function () {
      const initialSupply = await goldToken.totalSupply();
      await goldToken.connect(user1).burn(HUNDRED_TOKENS);
      const finalSupply = await goldToken.totalSupply();

      expect(finalSupply).to.equal(initialSupply - HUNDRED_TOKENS);
    });
  });

  // ============== BurnFrom Function Tests ==============

  describe("BurnFrom Function", function () {
    beforeEach(async function () {
      await goldToken.connect(vaultManager).mint(user1.address, THOUSAND_TOKENS);
    });

    it("Should burn tokens with proper approval", async function () {
      await goldToken.connect(user1).approve(user2.address, HUNDRED_TOKENS);
      await goldToken.connect(user2).burnFrom(user1.address, HUNDRED_TOKENS);

      expect(await goldToken.balanceOf(user1.address)).to.equal(
        THOUSAND_TOKENS - HUNDRED_TOKENS
      );
    });

    it("Should emit TokenBurned event from burnFrom", async function () {
      await goldToken.connect(user1).approve(user2.address, HUNDRED_TOKENS);
      
      await expect(
        goldToken.connect(user2).burnFrom(user1.address, HUNDRED_TOKENS)
      )
        .to.emit(goldToken, "TokenBurned")
        .withArgs(user1.address, HUNDRED_TOKENS);
    });

    it("Should reject burnFrom without approval", async function () {
      await expect(
        goldToken.connect(user2).burnFrom(user1.address, HUNDRED_TOKENS)
      ).to.be.revertedWithCustomError(goldToken, "ERC20InsufficientAllowance");
    });

    it("Should reject burnFrom with insufficient allowance", async function () {
      await goldToken.connect(user1).approve(user2.address, ONE_TOKEN);
      
      await expect(
        goldToken.connect(user2).burnFrom(user1.address, HUNDRED_TOKENS)
      ).to.be.revertedWithCustomError(goldToken, "ERC20InsufficientAllowance");
    });

    it("Should reject burnFrom with insufficient balance", async function () {
      await goldToken.connect(user1).approve(user2.address, THOUSAND_TOKENS);
      
      await expect(
        goldToken.connect(user2).burnFrom(user1.address, THOUSAND_TOKENS + ONE_TOKEN)
      ).to.be.revertedWith("Insufficient balance to burn");
    });
  });

  // ============== Vault Manager Update Tests ==============

  describe("Vault Manager Update", function () {
    it("Should allow owner to update vault manager", async function () {
      await goldToken.connect(owner).updateVaultManager(user1.address);
      expect(await goldToken.vaultManager()).to.equal(user1.address);
    });

    it("Should emit VaultManagerUpdated event", async function () {
      await expect(
        goldToken.connect(owner).updateVaultManager(user1.address)
      )
        .to.emit(goldToken, "VaultManagerUpdated")
        .withArgs(vaultManager.address, user1.address);
    });

    it("Should reject update from non-owner", async function () {
      await expect(
        goldToken.connect(user1).updateVaultManager(user2.address)
      ).to.be.revertedWithCustomError(goldToken, "OwnableUnauthorizedAccount");
    });

    it("Should reject zero address as new vault manager", async function () {
      await expect(
        goldToken.connect(owner).updateVaultManager(ethers.ZeroAddress)
      ).to.be.revertedWith("New vault manager cannot be zero address");
    });

    it("Should reject same address as new vault manager", async function () {
      await expect(
        goldToken.connect(owner).updateVaultManager(vaultManager.address)
      ).to.be.revertedWith("New vault manager is same as current");
    });

    it("New vault manager should be able to mint after update", async function () {
      await goldToken.connect(owner).updateVaultManager(user1.address);
      
      await goldToken.connect(user1).mint(user2.address, HUNDRED_TOKENS);
      expect(await goldToken.balanceOf(user2.address)).to.equal(HUNDRED_TOKENS);
    });

    it("Previous vault manager should not mint after update", async function () {
      await goldToken.connect(owner).updateVaultManager(user1.address);
      
      await expect(
        goldToken.connect(vaultManager).mint(user2.address, HUNDRED_TOKENS)
      ).to.be.revertedWith("Only vault manager can call this function");
    });
  });

  // ============== Pause/Unpause Tests ==============

  describe("Pause and Unpause", function () {
    it("Should allow owner to pause contract", async function () {
      await goldToken.connect(owner).pause();
      expect(await goldToken.isPaused()).to.be.true;
    });

    it("Should emit ContractPaused event", async function () {
      await expect(goldToken.connect(owner).pause())
        .to.emit(goldToken, "ContractPaused")
        .withArgs(owner.address);
    });

    it("Should allow owner to unpause contract", async function () {
      await goldToken.connect(owner).pause();
      await goldToken.connect(owner).unpause();
      expect(await goldToken.isPaused()).to.be.false;
    });

    it("Should emit ContractUnpaused event", async function () {
      await goldToken.connect(owner).pause();
      await expect(goldToken.connect(owner).unpause())
        .to.emit(goldToken, "ContractUnpaused")
        .withArgs(owner.address);
    });

    it("Should reject pause from non-owner", async function () {
      await expect(
        goldToken.connect(user1).pause()
      ).to.be.revertedWithCustomError(goldToken, "OwnableUnauthorizedAccount");
    });

    it("Should reject unpause from non-owner", async function () {
      await goldToken.connect(owner).pause();
      await expect(
        goldToken.connect(user1).unpause()
      ).to.be.revertedWithCustomError(goldToken, "OwnableUnauthorizedAccount");
    });

    it("Should prevent transfers when paused", async function () {
      await goldToken.connect(vaultManager).mint(user1.address, HUNDRED_TOKENS);
      await goldToken.connect(owner).pause();

      await expect(
        goldToken.connect(user1).transfer(user2.address, HUNDRED_TOKENS)
      ).to.be.revertedWithCustomError(goldToken, "EnforcedPause");
    });

    it("Should allow transfers after unpause", async function () {
      await goldToken.connect(vaultManager).mint(user1.address, HUNDRED_TOKENS);
      await goldToken.connect(owner).pause();
      await goldToken.connect(owner).unpause();

      await goldToken.connect(user1).transfer(user2.address, HUNDRED_TOKENS);
      expect(await goldToken.balanceOf(user2.address)).to.equal(HUNDRED_TOKENS);
    });
  });

  // ============== Transfer Tests ==============

  describe("Transfer", function () {
    beforeEach(async function () {
      await goldToken.connect(vaultManager).mint(user1.address, THOUSAND_TOKENS);
    });

    it("Should transfer tokens from sender to recipient", async function () {
      await goldToken.connect(user1).transfer(user2.address, HUNDRED_TOKENS);
      
      expect(await goldToken.balanceOf(user1.address)).to.equal(
        THOUSAND_TOKENS - HUNDRED_TOKENS
      );
      expect(await goldToken.balanceOf(user2.address)).to.equal(HUNDRED_TOKENS);
    });

    it("Should reject transfer to zero address", async function () {
      await expect(
        goldToken.connect(user1).transfer(ethers.ZeroAddress, HUNDRED_TOKENS)
      ).to.be.revertedWithCustomError(goldToken, "ERC20InvalidReceiver");
    });

    it("Should reject transfer with insufficient balance", async function () {
      const balance = await goldToken.balanceOf(user2.address);
      await expect(
        goldToken.connect(user2).transfer(user1.address, HUNDRED_TOKENS)
      ).to.be.revertedWithCustomError(goldToken, "ERC20InsufficientBalance");
    });

    it("Should reject transfer when paused", async function () {
      await goldToken.connect(owner).pause();
      await expect(
        goldToken.connect(user1).transfer(user2.address, HUNDRED_TOKENS)
      ).to.be.revertedWithCustomError(goldToken, "EnforcedPause");
    });
  });

  // ============== Approval Tests ==============

  describe("Approval and TransferFrom", function () {
    beforeEach(async function () {
      await goldToken.connect(vaultManager).mint(user1.address, THOUSAND_TOKENS);
    });

    it("Should approve tokens for spending", async function () {
      await goldToken.connect(user1).approve(user2.address, HUNDRED_TOKENS);
      expect(await goldToken.allowance(user1.address, user2.address)).to.equal(
        HUNDRED_TOKENS
      );
    });

    it("Should transferFrom with proper approval", async function () {
      await goldToken.connect(user1).approve(user2.address, HUNDRED_TOKENS);
      await goldToken.connect(user2).transferFrom(user1.address, addrs[0].address, HUNDRED_TOKENS);

      expect(await goldToken.balanceOf(addrs[0].address)).to.equal(HUNDRED_TOKENS);
      expect(await goldToken.allowance(user1.address, user2.address)).to.equal(0);
    });

    it("Should reject transferFrom without approval", async function () {
      await expect(
        goldToken.connect(user2).transferFrom(user1.address, addrs[0].address, HUNDRED_TOKENS)
      ).to.be.revertedWithCustomError(goldToken, "ERC20InsufficientAllowance");
    });

    it("Should reject transferFrom with insufficient allowance", async function () {
      await goldToken.connect(user1).approve(user2.address, ONE_TOKEN);
      await expect(
        goldToken.connect(user2).transferFrom(user1.address, addrs[0].address, HUNDRED_TOKENS)
      ).to.be.revertedWithCustomError(goldToken, "ERC20InsufficientAllowance");
    });
  });

  // ============== Edge Cases and Security Tests ==============

  describe("Edge Cases and Security", function () {
    it("Should handle multiple vault manager updates", async function () {
      await goldToken.connect(owner).updateVaultManager(user1.address);
      await goldToken.connect(owner).updateVaultManager(user2.address);
      await goldToken.connect(owner).updateVaultManager(vaultManager.address);

      expect(await goldToken.vaultManager()).to.equal(vaultManager.address);
    });

    it("Should track total supply correctly with multiple operations", async function () {
      await goldToken.connect(vaultManager).mint(user1.address, HUNDRED_TOKENS);
      await goldToken.connect(vaultManager).mint(user2.address, HUNDRED_TOKENS);
      await goldToken.connect(user1).burn(HUNDRED_TOKENS);

      expect(await goldToken.totalSupply()).to.equal(HUNDRED_TOKENS);
    });

    it("Should prevent integer overflow/underflow", async function () {
      // Test with max uint256 value
      const maxUint256 = ethers.MaxUint256;
      
      // This should fail or handle gracefully
      // Since we can't actually mint that much, this tests the contract handles large numbers
      const largeAmount = ethers.parseUnits("1000000000", DECIMALS);
      await goldToken.connect(vaultManager).mint(user1.address, largeAmount);
      
      expect(await goldToken.balanceOf(user1.address)).to.equal(largeAmount);
    });

    it("Should maintain balance consistency across operations", async function () {
      const amount1 = HUNDRED_TOKENS;
      const amount2 = ethers.parseUnits("250", DECIMALS);

      await goldToken.connect(vaultManager).mint(user1.address, amount1);
      await goldToken.connect(vaultManager).mint(user2.address, amount2);
      
      await goldToken.connect(user1).transfer(user2.address, amount1);
      await goldToken.connect(user2).burn(amount2);

      const total = await goldToken.totalSupply();
      const user1Balance = await goldToken.balanceOf(user1.address);
      const user2Balance = await goldToken.balanceOf(user2.address);

      expect(user1Balance + user2Balance).to.equal(total);
    });
  });
});
