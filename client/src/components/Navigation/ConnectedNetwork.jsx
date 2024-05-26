import { useContext } from "react"
import Web3Context from "../../context/Web3Context"

const ConnectedNetwork = ()=>{
   const {chainId}=useContext(Web3Context);
   if(chainId===null){
      return <p className="network">Not connected</p>;
   }
   else if (chainId === 11155111) {
      return <p className="network">Connected Network: Sepolia</p>;
    } else {
      return <p className="network">Connected Network: Unsupported</p>;
    }
}
export default ConnectedNetwork;