"use client";
import React, { useState, useEffect } from 'react';
import { BrowserProvider,Eip1193Provider } from "ethers";
import { ethers } from 'ethers';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
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
      const approveTx = await stakeTokenContract.approve(CONTRACT_ADDRESSES.STAKING, amountToApprove) as ethers.ContractTransactionResponse;
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

      const stakeTx = await stakingContract.stake(amountToStake) as ethers.ContractTransactionResponse;
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
      const withdrawTx = await stakingContract.withdrawStakedTokens(amountToWithdraw) as ethers.ContractTransactionResponse;
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
    <div>
      <Card className="shadow-xl border border-gray-200 rounded-2xl bg-white">
        <CardHeader className="text-center border-b pb-4">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Staking Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {/* Display balances */}
          <div className="grid grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-r from-blue-200 via-blue-100 to-blue-50 rounded-xl shadow-md">
              <div className="text-sm text-gray-600">Available to Stake</div>
              <div className="text-2xl font-bold text-blue-800">{tokenBalance}</div>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-200 via-green-100 to-green-50 rounded-xl shadow-md">
              <div className="text-sm text-gray-600">Staked Balance</div>
              <div className="text-2xl font-bold text-green-800">{stakedBalance}</div>
            </div>
            <div className="p-4 bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-50 rounded-xl shadow-md">
              <div className="text-sm text-gray-600">Rewards Available</div>
              <div className="text-2xl font-bold text-yellow-800">{rewardBalance}</div>
            </div>
          </div>
  
          {/* Input and Buttons */}
          <div className="space-y-4">
            <Input
              type="number"
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full border border-gray-300 rounded-lg p-3 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
  
            <div className="flex space-x-4">
              {needsApproval() && (
                <Button
                  onClick={handleApprove}
                  disabled={loading || !amount}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium py-3 px-5 rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:bg-gray-300"
                >
                  {loading ? "Approving..." : "Approve"}
                </Button>
              )}
              <Button
                onClick={handleStake}
                disabled={loading || !amount || needsApproval()}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-lg font-medium py-3 px-5 rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:bg-gray-300"
              >
                {loading ? "Staking..." : "Stake"}
              </Button>
              <Button
                onClick={handleWithdraw}
                disabled={loading || !amount}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-lg font-medium py-3 px-5 rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:bg-gray-300"
              >
                {loading ? "Withdrawing..." : "Withdraw"}
              </Button>
              <Button
                onClick={handleClaim}
                disabled={loading || rewardBalance === '0'}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white text-lg font-medium py-3 px-5 rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:bg-gray-300"
              >
                {loading ? "Claiming..." : "Claim Rewards"}
              </Button>
            </div>
          </div>
  
          {/* Loading spinner */}
          {loading && (
            <div className="flex justify-center mt-6">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-800 h-8 w-8"></div>
            </div>
          )}
  
          {/* Alerts */}
          {error && (
            <Alert
              variant="destructive"
              className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg shadow-md"
            >
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <AlertTitle className="text-red-800 font-semibold">Error</AlertTitle>
                <AlertDescription className="text-sm text-red-600">{error}</AlertDescription>
              </div>
            </Alert>
          )}
  
          {success && (
            <Alert className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg shadow-md">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <AlertTitle className="text-green-800 font-semibold">Success</AlertTitle>
                <AlertDescription className="text-sm text-green-600">{success}</AlertDescription>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
  
  
};

export default StakingInterface;