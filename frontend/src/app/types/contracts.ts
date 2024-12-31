import { ContractTransaction } from "ethers";
// Define the Staking Token contract interface
export interface StakingTokenContract {
  name(): Promise<string>;
  symbol(): Promise<string>;
  decimals(): Promise<number>;
  totalSupply(): Promise<bigint>;
  balanceOf(account: string): Promise<bigint>;
  transfer(recipient: string, amount: bigint): Promise<ContractTransaction>;
  allowance(owner: string, spender: string): Promise<bigint>;
  approve(spender: string, amount: bigint): Promise<ContractTransaction>;
  transferFrom(sender: string, recipient: string, amount: bigint): Promise<ContractTransaction>;
}

// Reward Token inherits Staking Token
export interface RewardTokenContract extends StakingTokenContract {}

// Define the Staking contract interface
export interface StakingContract {
  s_stakingToken(): Promise<string>;
  s_rewardToken(): Promise<string>;
  REWARD_RATE(): Promise<bigint>;
  totalStakedTokens(): Promise<bigint>;
  rewardPerTokenStored(): Promise<bigint>;
  lastUpdateTime(): Promise<bigint>;
  stakedBalance(account: string): Promise<bigint>;
  rewards(account: string): Promise<bigint>;
  userRewardPerTokenPaid(account: string): Promise<bigint>;
  rewardPerToken(): Promise<bigint>;
  earned(account: string): Promise<bigint>;
  stake(amount: bigint): Promise<ContractTransaction>;
  withdrawStakedTokens(amount: bigint): Promise<ContractTransaction>;
  getReward(): Promise<ContractTransaction>;
}
