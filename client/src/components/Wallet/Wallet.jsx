import { useEffect,useState } from "react";

const Wallet=()=>{
    const [state,setState]=useState({
        provider:null,
        address:null,
        stakingContract:null,
        stakeToken:null,
        chainId:null   
    })

    const [isLoading,setIsLoading]=useState(false);

    const handleWallet = async()=>{

        try{
            setIsLoading(true);
            const { provider,address,stakingContract,stakeToken,chainId } = await connectWallet();
            setState({provider,address,stakingContract,stakeToken,chainId})

        }catch(error){
            console.log("Error connecting wallet: ",error.message);
        }finally{
            setIsLoading(false);
        }
    }
}
export default Wallet;