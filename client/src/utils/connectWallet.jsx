import { ethers,Contract } from "ethers";
import StakingAbi from "../ABI/StakingAbi.json";
import StakeTokenAbi from "../ABI/StakeTokenAbi.json";


export const connectWallet = async()=>{
    try {
        let [signer,provider,stakingContract,stakeTokenContract,chainId]=[null];
        if(window.ethereum===null){
            throw new Error("Metamask is not installed");
        }
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        let chainIdHex = await window.ethereum.request({
            method: "eth_chainId",
        })
        chainId= parseInt(chainIdHex,16)
        
        let selectedAccount = accounts[0];
        if(!selectedAccount){
            throw new Error("No ethereum accounts available")
        }

        provider = new ethers.BrowserProvider(window.ethereum);
        signer =  await provider.getSigner();

        const stakingContractAddress="0x8e6105De0B3603F65a47247C36704c19aAd71dEE"
        const stakeTokenContractAddress="0x2365a8e465730b079b0f620d700b382c5388d4b4"

        stakingContract= new Contract(stakingContractAddress,StakingAbi,signer);
        stakeTokenContract= new Contract(stakeTokenContractAddress,StakeTokenAbi,signer);

        return{provider,selectedAccount,stakeTokenContract,stakingContract,chainId}


    } catch (error) {
        console.error(error);
        throw error
    }
}