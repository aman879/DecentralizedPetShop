import { useState, useEffect} from "react";
import { Navbar } from "./components/Navbar";
import { PetItems } from "./components/PetItems";
import { TxError } from "./components/TxError";
import { WalletNotDetected } from "./components/WalletNotDetected";
import { ConnectWallet } from "./components/ConnectWallet";

const HARDHAT_NETWORK_ID = Number(31337)

function Dapp() {
  const [pets, setPets] = useState([])
  const [selectedAddress, setAddress] = useState(undefined)

  useEffect(() => {
    async function fetchPets() {
      const res = await fetch("./pets.json")
      const data = await res.json()
      setPets(data)
    }

    fetchPets()
  }, [])

  async function connectWallet() {
    try {
      const [address] = await window.ethereum.request({method: "eth_requestAccounts"})

      await checkNetwork()
      setAddress(address)

      window.ethereum.on("accountsChanged", ([newAddress]) => {
        if( newAddress === undefined ) {
          return
        }
        setAddress(newAddress)
      })
    } catch(e) {
      console.log(e.message);
    }
  }

  async function switchNetwork() {
    const chainIdHex = `0x${HARDHAT_NETWORK_ID.toString(16)}`
    
    return await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{chainId: chainIdHex}]
    })
  }

  async function checkNetwork() {

    if(window.ethereum.networkVersion !== HARDHAT_NETWORK_ID.toString()) {
      alert("Switching to Hardhat")
      return switchNetwork()
    }

    return null
  }

  if(window.ethereum === undefined) {
    return <WalletNotDetected />
  }

  if(selectedAddress === undefined) {
    return <ConnectWallet connect={connectWallet}/>
  }

  return (
    <div className="container">
      <TxError />
      <br />
      <Navbar address={selectedAddress}/>
      <div className="items">
        { pets.map(pet =>
          <PetItems key={pet.id} pet={pet}/>
        )}
      </div>
    </div>
  );
}

export default Dapp;