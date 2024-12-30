"use client";
import React, { useState, useEffect } from 'react';
import { BrowserProvider,Eip1193Provider } from "ethers";
import { ethers } from 'ethers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getStakeTokenContract, getStakingContract } from '@/app/utils/contractHelpers';
import { CONTRACT_ADDRESSES } from '@/app/config/contracts';

// Extend Window interface to include ethereum property
declare global {
    interface Window {
      ethereum: Eip1193Provider & BrowserProvider;
    }
}

const StakingInterface: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [stakedBalance, setStakedBalance] = useState<string>('0');
  const [rewardBalance, setRewardBalance] = useState<string>('0');
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [allowance, setAllowance] = useState<string>('0');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadBlockchainData = async (): Promise<void> => {
      try {
        if (!window.ethereum) {
          throw new Error('Please install MetaMask to use this dApp');
        }
        await window.ethereum.request?.({ method: 'eth_requestAccounts' });
        await updateBalances();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      }
    };

    loadBlockchainData();
  }, []);

  const updateBalances = async (): Promise<void> => {
    try {
      if (!window.ethereum) throw new Error('No ethereum provider found');
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Get contract instances with type casting
      const stakingContract = getStakingContract(signer);
      const stakeTokenContract = getStakeTokenContract(signer);
      

      // Get balances
      const [stakedBal, rewardBal, tokenBal, currentAllowance] = await Promise.all([
  stakingContract.stakedBalance(address),
  stakingContract.earned(address),
  stakeTokenContract.balanceOf(address),
  stakeTokenContract.allowance(address, CONTRACT_ADDRESSES.STAKING)
]);

      setStakedBalance(ethers.formatEther(stakedBal));
      setRewardBalance(ethers.formatEther(rewardBal));
      setTokenBalance(ethers.formatEther(tokenBal));
      setAllowance(ethers.formatEther(currentAllowance));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error updating balances');
    }
  };

  const handleApprove = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      if (!window.ethereum) throw new Error('No ethereum provider found');
      if (!amount) throw new Error('Please enter an amount');
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const stakeTokenContract = getStakeTokenContract(signer);
      
      const amountToApprove = ethers.parseEther(amount);
      const approveTx = await stakeTokenContract.approve(CONTRACT_ADDRESSES.STAKING, amountToApprove);
      await approveTx.wait();

      setSuccess('Successfully approved tokens!');
      await updateBalances();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error approving tokens');
    } finally {
      setLoading(false);
    }
  };

  const handleStake = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      if (!window.ethereum) throw new Error('No ethereum provider found');
      if (!amount) throw new Error('Please enter an amount');
      
      const amountToStake = ethers.parseEther(amount);
      if (amountToStake > ethers.parseEther(allowance)) {
        throw new Error('Please approve tokens first');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const stakingContract = getStakingContract(signer);

      const stakeTx = await stakingContract.stake(amountToStake);
      await stakeTx.wait();

      setSuccess('Successfully staked tokens!');
      setAmount('');
      await updateBalances();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error staking tokens');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      if (!window.ethereum) throw new Error('No ethereum provider found');
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const stakingContract = getStakingContract(signer);

      const amountToWithdraw = ethers.parseEther(amount);
      const withdrawTx = await stakingContract.withdrawStakedTokens(amountToWithdraw);
      await withdrawTx.wait();

      setSuccess('Successfully withdrawn tokens!');
      setAmount('');
      await updateBalances();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error withdrawing tokens');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      if (!window.ethereum) throw new Error('No ethereum provider found');
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const stakingContract = getStakingContract(signer);
      
      const claimTx = await stakingContract.getReward() as ethers.ContractTransactionResponse;
      await claimTx.wait();

      setSuccess('Successfully claimed rewards!');
      await updateBalances();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error claiming rewards');
    } finally {
      setLoading(false);
    }
  };

  const needsApproval = (): boolean => {
    try {
      if (!amount) return false;
      return ethers.parseEther(amount) > ethers.parseEther(allowance);
    } catch {
      return false;
    }
  };


  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Staking Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-100 rounded">
                <div className="text-sm text-gray-600">Available to Stake</div>
                <div className="text-lg font-semibold">{tokenBalance}</div>
              </div>
              <div className="p-4 bg-gray-100 rounded">
                <div className="text-sm text-gray-600">Staked Balance</div>
                <div className="text-lg font-semibold">{stakedBalance}</div>
              </div>
              <div className="p-4 bg-gray-100 rounded">
                <div className="text-sm text-gray-600">Rewards Available</div>
                <div className="text-lg font-semibold">{rewardBalance}</div>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                type="number"
                value={amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full"
              />

              <div className="flex space-x-4">
                {needsApproval() && (
                  <Button 
                    onClick={handleApprove} 
                    disabled={loading || !amount}
                    className="flex-1"
                    variant="outline"
                  >
                    Approve
                  </Button>
                )}
                <Button 
                  onClick={handleStake} 
                  disabled={loading || !amount || needsApproval()}
                  className="flex-1"
                >
                  Stake
                </Button>
                <Button 
                  onClick={handleWithdraw} 
                  disabled={loading || !amount}
                  className="flex-1"
                >
                  Withdraw
                </Button>
                <Button 
                  onClick={handleClaim} 
                  disabled={loading || rewardBalance === '0'}
                  className="flex-1"
                >
                  Claim Rewards
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StakingInterface;