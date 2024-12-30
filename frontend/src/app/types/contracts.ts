import { ethers } from 'ethers';

export interface StakingTokenContract extends ethers.Contract {
  name(): Promise<string>;
  symbol(): Promise<string>;
  decimals(): Promise<number>;
  totalSupply(): Promise<ethers.BigNumber>;
  balanceOf(account: string): Promise<ethers.BigNumber>;
  transfer(recipient: string, amount: ethers.BigNumber): Promise<boolean>;
  allowance(owner: string, spender: string): Promise<ethers.BigNumber>;
  approve(spender: string, amount: ethers.BigNumber): Promise<boolean>;
  transferFrom(sender: string, recipient: string, amount: ethers.BigNumber): Promise<boolean>;
}

export interface RewardTokenContract extends StakingTokenContract {}

export interface StakingContract extends ethers.Contract {
  s_stakingToken(): Promise<string>;
  s_rewardToken(): Promise<string>;
  REWARD_RATE(): Promise<ethers.BigNumber>;
  totalStakedTokens(): Promise<ethers.BigNumber>;
  rewardPerTokenStored(): Promise<ethers.BigNumber>;
  lastUpdateTime(): Promise<ethers.BigNumber>;
  stakedBalance(account: string): Promise<ethers.BigNumber>;
  rewards(account: string): Promise<ethers.BigNumber>;
  userRewardPerTokenPaid(account: string): Promise<ethers.BigNumber>;
  rewardPerToken(): Promise<ethers.BigNumber>;
  earned(account: string): Promise<ethers.BigNumber>;
  stake(amount: ethers.BigNumber): Promise<ethers.ContractTransaction>;
  withdrawStakedTokens(amount: ethers.BigNumber): Promise<ethers.ContractTransaction>;
  getReward(): Promise<ethers.ContractTransaction>;
}