const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Staking", function () {
  let Staking, staking, owner, addr1, addr2;
  let stakingToken, rewardToken;

  beforeEach(async () => {
    // Deploy mock tokens for testing
    const ERC20 = await ethers.getContractFactory("ERC20");
    stakingToken = await ERC20.deploy("StakingToken", "STK");
    rewardToken = await ERC20.deploy("RewardToken", "RWD");

    // Deploy the Staking contract
    Staking = await ethers.getContractFactory("Staking");
    staking = await Staking.deploy(stakingToken.address, rewardToken.address);

    [owner, addr1, addr2, _] = await ethers.getSigners();
  });

  describe("Staking and withdrawing", function () {
    it("Should allow users to stake and withdraw tokens", async function () {
      // Transfer some tokens to addr1
      await stakingToken.transfer(addr1.address, 1000);

      // Approve the Staking contract to spend addr1's tokens
      await stakingToken.connect(addr1).approve(staking.address, 1000);

      // Stake tokens
      await staking.connect(addr1).stake(500);
      expect(await staking.stakedBalance(addr1.address)).to.equal(500);

      // Withdraw tokens
      await staking.connect(addr1).withdraw(200);
      expect(await staking.stakedBalance(addr1.address)).to.equal(300);
    });
  });

});