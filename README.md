# Staking Dapp
## It only works for Sepolia Network which is the testnet of the Ethereum
- Here I have created three smart contracts:
1. **StakeToken.sol:**   simple ERC20 tokens
2. **RewardToken.sol:**   simple ERC20 tokens
3. **Staking.sol:**  This smart contract consists of approve, withdraw, get a reward, and stake functions.
4. It uses the staking algorithm which calculates the **reward/sec**.
   
         `Reward token =(amount staked by user/total staked amount)*reward rate`

                                 `reward token=(S/T)*R`
   
   
    

## Here first you have to approve some tokens, then you can stake the stake tokens to get the reward tokens.

  
