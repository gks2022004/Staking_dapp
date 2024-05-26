import { useState,useContext,useRef } from "react";
import {ethers} from "ethers";
import Button from "../Button";
import Web3Context from "../../context/Web3Context";    
import StakingContext from "../../context/StakingContext";

const StakeAmount = () => {
    const [transactionStatus,setTransactionStatus]=useState("")
    const {stakingContract}=useContext(Web3Context);
    const {isReload, setIsReload} =useContext(StakingContext)
    const stakeAmountRef = useRef();
   

    const stakeToken=async(e)=>{
        e.preventDefault();
        const amount = stakeAmountRef.current.value.trim();
        if(isNaN(amount) || amount<=0){
            console.error("Please enter a valid positive number");
            return;
        }
        const amountToStake = ethers.parseUnits(amount,18).toString();
        try{
           const transaction = await stakingContract.stake(amountToStake);
           setTransactionStatus("Transaction is in pending...")
           const receipt = await transaction.wait();
           if (receipt.status === 1){
            setTransactionStatus("Transaction is Successful");
            setIsReload(!isReload);
            setTimeout(()=>{
                setTransactionStatus("")
            },5000)
            stakeAmountRef.current.value=""
           }else{
            setTransactionStatus("Staking is Failed");
           }
        }catch(error){
            console.log("Token Approval Failed", error.message);
        }
    }

  return (
    <div>
        {transactionStatus && <div>{transactionStatus}</div>}
      <form onSubmit={stakeToken}>
        <label>Amount to Stake: </label>
        <input type="text" ref={stakeAmountRef}></input>
        <Button onClick={stakeToken} type="submit" label="Stake" />

      </form>
    </div>
  )
}

export default StakeAmount;
