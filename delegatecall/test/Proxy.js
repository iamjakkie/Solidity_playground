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

    describe('delegatecall', () => {
        it('Set the value through delegatecall', async () => {
            const proxyAsOwner = proxy.connect(owner);

            expect(await proxyAsOwner.libraryAddress()).to.equal(library.target);

            const tx = await proxyAsOwner.setValue(10);
            await tx.wait();

            const proxyValue = await proxyAsOwner.value();
            expect(proxyValue).to.equal(0);
            const libraryValue = await library.value();
            expect(libraryValue).to.equal(10);
        })
    });
})