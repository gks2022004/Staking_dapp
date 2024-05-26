import './App.css'
import ClaimReward from './components/ClaimedReward/ClaimedReward'
import DisplayPanel from './components/Display Panel/DisplayPanel'
import Navigation from './components/Navigation/Navigation'
import StakeAmount from './components/StakeToken/StakeAmount'
import TokenApproval from './components/StakeToken/TokenApproval'
import Wallet from './components/Wallet/Wallet'
import WithdrawStakeAmount from './components/Withdraw/Withdraw'
import { StakingProvider } from './context/StakingContext'

function App() {

  return (
    <>
      <Wallet>
      <Navigation/>
      <StakingProvider>
      <DisplayPanel/>
      <StakeAmount />
      <TokenApproval/>
      <WithdrawStakeAmount/>
      </StakingProvider>

      <ClaimReward/>
      
      </Wallet>

    </>
  )
}

export default App
