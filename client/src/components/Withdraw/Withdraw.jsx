import { useState,useContext,useRef } from "react";
import {ethers} from "ethers";
import Button from "../Button";
import Web3Context from "../../context/Web3Context";    
import StakingContext from "../../context/StakingContext";

const WithdrawStakeAmount = () => {
    const [transactionStatus,setTransactionStatus]=useState("")
    const {stakingContract}=useContext(Web3Context);
    const {isReload, setIsReload} =useContext(StakingContext)
    const WithdrawStakeAmountRef = useRef();
   

    const WithdrawStakeToken=async(e)=>{
        e.preventDefault();
        const amount = WithdrawStakeAmountRef.current.value.trim();
        console.log(amount);
        if(isNaN(amount) || amount<=0){
            console.error("Please enter a valid positive number");
            return;
        }
        const amountToWithdraw = ethers.parseUnits(amount,18).toString();
        console.log(amountToWithdraw);
        try{
           const transaction = await stakingContract.withdrawStakedTokens(amountToWithdraw);
           setTransactionStatus("Transaction is in pending...")
           setIsReload(!isReload)
           const receipt = await transaction.wait();
           if (receipt.status === 1){
            setTransactionStatus("Transaction is Successful");
            setTimeout(()=>{
                setTransactionStatus("")
            },5000)
            WithdrawStakeAmountRef.current.value=""
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
      <form onSubmit={WithdrawStakeToken}>
        <label>Amount to Withdraw: </label>
        <input type="text" ref={WithdrawStakeAmountRef}></input>
        <Button onClick={WithdrawStakeToken} type="submit" label="Withdraw Stake Token" />

      </form>
    </div>
  )
}

export default WithdrawStakeAmount;
