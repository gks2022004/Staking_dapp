import EarnedReward from "./EarnedReward"
import RewardRate from "./RewardRate"
import StakedAmount from "./StakedAmount"

const DisplayPanel = () => {
  return (
    <div>
      <StakedAmount />
      <EarnedReward />
      <RewardRate />
    </div>
  )
}

export default DisplayPanel
