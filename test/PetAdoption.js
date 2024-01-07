
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PetAdoption", function () {
    async function deployContractFixture() {
        const PETS_COUNT = 5
        const ADOPT_INDEX = 0;
        const [owner, account2, account3 ] = await ethers.getSigners()
        const PetAdoption = await ethers.getContractFactory("PetAdoption")
        const contract = await PetAdoption.deploy(PETS_COUNT)

        await contract.connect(account3).adoptPet(ADOPT_INDEX)

        return { 
            owner,
            contract,
            account2, 
            account3,
            petsAddedCount: PETS_COUNT,
            adoptPetId: ADOPT_INDEX
        }
    }

    describe("Deployement", function() {
        it("Should return the right owner", async function() {
            const { owner, contract } = await loadFixture(deployContractFixture)

            expect(await contract.getOwner()).to.equal(owner.address)
        })
    })

    describe("Add pet", function() {
        it("Should revert with only owner error if called from another accounts", async function() {
            const { owner, contract, account2 } = await loadFixture(deployContractFixture)

            await expect(contract.connect(account2).addPet()).to.be.revertedWith("Only owner can use this function")
        })

        it("Should increase pet index", async function() {
            const { contract, petsAddedCount } =  await loadFixture(deployContractFixture)

            await contract.addPet()
            
            expect(await contract.petIndex()).to.equal(petsAddedCount + 1)
        })
    })

    describe("Adopt Pet", function() {
        it("Should revert with index out of bound", async function() {
            const { contract, petsAddedCount } = await loadFixture(deployContractFixture)

            await expect(contract.adoptPet(petsAddedCount)).to.be.revertedWith("Pet index out of bound")
        })

        it("Should revert with Pet already adopted", async function() {
            const { contract, adoptPetId } = await loadFixture(deployContractFixture)
            
            await expect(contract.adoptPet(adoptPetId)).to.be.revertedWith("Pet is already adopted")
        })

        it("Should succesfuly adopt pet", async function() {
            const { contract, account2} = await loadFixture(deployContractFixture)

            await expect(contract.connect(account2).adoptPet(1)).not.to.be.reverted
        })

        it("Should link pet ID with owner address", async function () {
            const { contract, account3 } = await loadFixture(deployContractFixture)

            expect(await contract.getPetOwner(0)).to.equal(account3.address)
        })

        it("Should push pet list to its owner array", async function() {
            const { contract, account2 } = await loadFixture(deployContractFixture)
            const firstPetId = 1
            const secondPetId = 2

            
            await contract.connect(account2).adoptPet(firstPetId)
            await contract.connect(account2).adoptPet(secondPetId)

            const petsByOwner = await contract.connect(account2).getAllAdoptedPetsByOwner(account2)

            expect(petsByOwner.length).to.equal(2)
        })

        it("should add adopted pets in adopted list", async function() {
            const { contract, account2 } = await loadFixture(deployContractFixture)

            const petId = 1

            await contract.connect(account2).adoptPet(petId)
            const allPet = await contract.getAllAdoptedPets()

            expect(allPet.length).to.equal(2)
        })

        it("Should give correct adopted pet", async function() {
            const { contract } = await loadFixture(deployContractFixture)

            const petId = 1

            await contract.adoptPet(petId)

            expect(await contract.getAdoptedpetByIndex(1)).to.equal(petId)
        })

        it("should return zero address for pet which are not adopted", async function() {
            const { contract } = await loadFixture(deployContractFixture)

            const zeroAddress = await contract.getPetOwner(100)

            expect(zeroAddress).to.equal("0x0000000000000000000000000000000000000000")
        })
    })
})


// npx hardhat test --network networkName