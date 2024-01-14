import { useState, useEffect} from "react";
import { Navbar } from "./components/Navbar";
import { PetItems } from "./components/PetItems";
import { TxError } from "./components/TxError";
import { WalletNotDetected } from "./components/WalletNotDetected";
import { ConnectWallet } from "./components/ConnectWallet";

import { ethers } from "ethers"
import { contractAddress } from "./address"
import PetAdoptionArtifact from "./contracts/PetAdoption.json"
import { TxInfo } from "./components/TxInfo";

const HARDHAT_NETWORK_ID = Number(process.env.REACT_APP_NETWORK_ID);
console.log(process.env.REACT_APP_NETWORK_ID)

function Dapp() {
  const [pets, setPets] = useState([])
  const [adoptedPets, setAdoptedPets] = useState([])
  const [ownedPets, setOwnedPets] = useState([])
  const [selectedAddress, setAddress] = useState(undefined)
  const [contract, setContract] = useState(undefined)
  const [txError, setTxError] = useState(undefined)
  const [txinfo, setTxInfo] = useState(undefined)
  const [view, setView] = useState("home")

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
      initiliazeDapp(address)

      window.ethereum.on("accountsChanged", ([newAddress]) => {
        if( newAddress === undefined ) {
          setAdoptedPets([])
          setAddress([])
          setOwnedPets([])
          setContract(undefined)
          setTxError(undefined)
          setTxInfo(undefined)
          setView("home")

          return
        }
        
        initiliazeDapp(newAddress)
      })
    } catch(e) {
      console.log(e.message);
    }
  }

  async function initiliazeDapp(address) {
    setAddress(address)
    const contract = await initContract();

    getAdoptedPets(contract)
  }

  async function initContract() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const contract = new ethers.Contract(
      contractAddress.PetAdoption,
      PetAdoptionArtifact.abi,
      await provider.getSigner(0)
    )

    setContract(contract)
    return contract
  }

  async function getAdoptedPets(contract) {
    try {
      const adoptedPets = await contract.getAllAdoptedPets()
      const ownedPets = await contract.getAllAdoptedPetsByOwner()

      if(adoptedPets.length > 0) {
        setAdoptedPets(adoptedPets.map(petIdx => Number(petIdx)))   // convert big number to number
      } else {
        setAdoptedPets([])
      }

      if(ownedPets.length > 0) {
        setOwnedPets(ownedPets.map(petIdx => Number(petIdx)))
      } else {
        setOwnedPets([])
      }

    } catch(e) {
      console.log(e.message)
    }
  }

  async function adoptPet(id) {
    try {
      const tx = await contract.adoptPet(id)
      setTxInfo(tx.hash)
      const receipt = await tx.wait()

      if (receipt.status === 0) {
        throw new Error("Transaction Failed!")
      }

      setAdoptedPets([...adoptedPets, id])
      setOwnedPets([...ownedPets, id])
    } catch(e) {
      setTxError(e?.reason)
      console.log(e.reason)
    } finally {
      setTxInfo(undefined)
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

    if(window.ethereum.net_version !== HARDHAT_NETWORK_ID.toString()) {
      alert("Switching network")
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
      { txinfo &&
        <TxInfo
          message={txinfo}
        />
      }
      { txError &&
        <TxError 
          dismiss={() => setTxError(undefined)}
          message={txError}
        />
      }
      <br />
      <Navbar 
        setView={setView}
        address={selectedAddress}
      />
      <div className="items">
      {
        view === "home" ?
          pets.map(pet =>
            <PetItems 
              key={pet.id} 
              pet={pet}
              inProgress={!!txinfo}
              disabled={adoptedPets.includes(pet.id)}
              adoptPet={() => adoptPet(pet.id)}
            />
          ) :
          pets
            .filter(pet => ownedPets.includes(pet.id))
            .map(pet =>
              <PetItems 
                key={pet.id} 
                pet={pet}
                inProgress={!!txinfo}
                disabled={ownedPets.includes(pet.id)}
                adoptPet={() => adoptPet(pet.id)}
              />
          )
      }
      </div> 
      
    </div>
  );
}

export default Dapp;