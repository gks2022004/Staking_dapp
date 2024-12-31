import StakingInterface from "@/app/components/StakingInterface";
import { FaKey, FaCoins, FaHandHoldingUsd, FaGift } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Staking Journey Dashboard
      </h1>

      {/* Step-by-Step Graphics with Arrows */}
      <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-8 mb-12">
        {/* Step 1: Approve */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center shadow-lg">
            <FaKey className="text-blue-600 text-4xl" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Approve Tokens</h2>
          <p className="text-sm text-gray-600">
            Allow the staking contract to manage your tokens.
          </p>
        </div>

        {/* Arrow */}
        <div className="hidden lg:block">
          <div className="w-12 h-12 flex items-center justify-center">
            <span className="text-gray-400 text-4xl">→</span>
          </div>
        </div>

        {/* Step 2: Stake */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-lg">
            <FaCoins className="text-green-600 text-4xl" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Stake Tokens</h2>
          <p className="text-sm text-gray-600">
            Lock your tokens into the staking pool.
          </p>
        </div>

        {/* Arrow */}
        <div className="hidden lg:block">
          <div className="w-12 h-12 flex items-center justify-center">
            <span className="text-gray-400 text-4xl">→</span>
          </div>
        </div>

        {/* Step 3: Withdraw */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center shadow-lg">
            <FaHandHoldingUsd className="text-yellow-600 text-4xl" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Withdraw Tokens</h2>
          <p className="text-sm text-gray-600">
            Retrieve your staked tokens when needed.
          </p>
        </div>

        {/* Arrow */}
        <div className="hidden lg:block">
          <div className="w-12 h-12 flex items-center justify-center">
            <span className="text-gray-400 text-4xl">→</span>
          </div>
        </div>

        {/* Step 4: Claim Rewards */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center shadow-lg">
            <FaGift className="text-purple-600 text-4xl" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Claim Rewards</h2>
          <p className="text-sm text-gray-600">
            Enjoy the rewards you’ve earned from staking.
          </p>
        </div>
      </div>

      {/* Staking Interface */}
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
        <StakingInterface />
      </div>
    </div>
  );
}
