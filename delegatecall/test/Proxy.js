const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('Proxy test', () => {
    let owner;
    beforeEach(async () => {
        owner = await ethers.getSigners();

        const Library = await ethers.getContractFactory('Library');
        const library = await Library.deploy();
        await library.deployed();

        const Proxy = await ethers.getContractFactory('Proxy');
        const proxy = await Proxy.deploy(library.address);
        await proxy.deployed();
    })

    describe('delegatecall', () => {
        it('')
    });
})