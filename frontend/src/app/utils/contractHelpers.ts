import { ethers } from 'ethers';
import { 
  StakingContract, 
  StakingTokenContract, 
  RewardTokenContract 
} from '../types/contracts';
import { 
  CONTRACT_ADDRESSES, 
  STAKING_ABI, 
  STAKE_TOKEN_ABI, 
  REWARD_TOKEN_ABI 
} from '../config/contracts';

export const getStakingContract = (
  signerOrProvider: ethers.Signer | ethers.Provider
): StakingContract => {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.STAKING,
    STAKING_ABI,
    signerOrProvider
  ) as StakingContract;
};

export const getStakeTokenContract = (
  signerOrProvider: ethers.Signer | ethers.Provider
): StakingTokenContract => {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.STAKE_TOKEN,
    STAKE_TOKEN_ABI,
    signerOrProvider
  ) as StakingTokenContract;
};

export const getRewardTokenContract = (
  signerOrProvider: ethers.Signer | ethers.Provider
): RewardTokenContract => {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.REWARD_TOKEN,
    REWARD_TOKEN_ABI,
    signerOrProvider
  ) as RewardTokenContract;
};