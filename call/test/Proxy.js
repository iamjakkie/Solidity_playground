const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('Proxy test', () => {
    let owner, library, proxy;
    before(async () => {
        [owner] = await ethers.getSigners();

        const Library = await ethers.getContractFactory('Library');
        library = await Library.deploy();

        const Proxy = await ethers.getContractFactory('Proxy');
        proxy = await Proxy.deploy(library.target);

    })

    describe('call', () => {
        it('Increment the value through call', async () => {
            expect(await proxy.libraryAddress()).to.equal(library.target);

            await proxy.callIncrement();
            expect(await library.number()).to.equal(1);

            await proxy.callIncrement();
            expect(await library.number()).to.equal(2);
        })
    });
})