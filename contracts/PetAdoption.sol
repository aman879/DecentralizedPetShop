
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

contract PetAdoption {
    address private owner;
    uint public petIndex = 0;    //Pet number
    uint[] private allAdoptedPets;

    mapping(uint => address) private petIdToOwnerAddress;
    mapping(address => uint[]) private ownerAddressToPetList;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can use this function");
        _;
    }

    constructor(uint initialPetIndex) {
        owner = msg.sender;
        petIndex = initialPetIndex;
    }

    function addPet() public onlyOwner() {
        petIndex++;
    }

    function adoptPet(uint adpotId) public {
        require(adpotId < petIndex, "Pet index out of bound");
        require(petIdToOwnerAddress[adpotId] == address(0), "Pet is already adopted");

        petIdToOwnerAddress[adpotId] = msg.sender;
        ownerAddressToPetList[msg.sender].push(adpotId);
        allAdoptedPets.push(adpotId);
    }

    function getOwner() public view returns(address) {
        return owner;
    }

    function getPetOwner(uint id) public view returns(address) {
        return petIdToOwnerAddress[id];
    }

    function getAllAdoptedPetsByOwner() public view returns(uint[] memory) {
        return ownerAddressToPetList[msg.sender];
    }

    function getAllAdoptedPets() public view returns(uint[] memory) {
        return allAdoptedPets;
    }

    function getAdoptedpetByIndex(uint id) public view returns(uint) {
        return allAdoptedPets[id];
    }
}