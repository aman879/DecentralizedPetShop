
const hre = require("hardhat")
const path = require("path")
const fs = require("fs")

async function main() {
    console.log("Deployement started!")

    const [deployer] = await ethers.getSigners()
    const address = await deployer.getAddress()
    console.log(`Deploying the contract with the account: ${address}`)

    const PETS_COUNT = 5;
    const PetAdoption = await hre.ethers.getContractFactory("PetAdoption")
    const contract = await PetAdoption.deploy(PETS_COUNT)
    const contractAddress = await contract.getAddress()

    console.log(`PetAdoption deployed to ${contractAddress}`)
}

main().catch(error => {
    console.log(error)
    process.exitCode = 1
})


// npx hardhat run scripts/deploy.js 