import { useState,useContext} from "react";
import Button from "../Button";
import Web3Context from "../../context/Web3Context";    


const ClaimReward = () => {
    const [transactionStatus,setTransactionStatus]=useState("")
    const {stakingContract}=useContext(Web3Context);
    

    const claimReward=async()=>{
        try{
           const transaction = await stakingContract.getReward();
           const receipt = await transaction.wait();
           setTransactionStatus("Transaction is in pending...")
           if (receipt.status === 1){
            setTransactionStatus("Transaction is Successful");
            setTimeout(()=>{
                setTransactionStatus("")
            },5000)
           }else{
            setTransactionStatus("Transaction failed. Please try again.");
           }
        }catch(error){
            console.log("Claim Reward Failed", error.message);
        }
    }

  return (
    <div>
        {transactionStatus && <div>{transactionStatus}</div>}
        <Button type="button" label="Claim Reward"
         onClick={claimReward}/>
    </div>
  )
}

export default ClaimReward;
