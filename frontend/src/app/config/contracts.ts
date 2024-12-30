import StakingAbi from '../ABI/StakingAbi.json';
import StakeTokenAbi from '../ABI/StakeTokenAbi.json';
export const CONTRACT_ADDRESSES = {
    STAKING: '0x9fD390aFD11861E25AFA47B1A9b955008c86666D',
    STAKE_TOKEN: '0x6fDE2580209344dcCF947ad2F47C8460aEEE443f',
    REWARD_TOKEN: '0x36BA6D1f6097ee1A5b06fC6769183D3f0bD552E6'
  } as const;
  
  export const STAKE_TOKEN_ABI = StakeTokenAbi;
  
  export const REWARD_TOKEN_ABI = STAKE_TOKEN_ABI;
  
  export const STAKING_ABI = StakingAbi
  


  // StakeToken: 0x6fDE2580209344dcCF947ad2F47C8460aEEE443f

// RewardToken:  0x36BA6D1f6097ee1A5b06fC6769183D3f0bD552E6

// Staking contract:  0x9fD390aFD11861E25AFA47B1A9b955008c86666D