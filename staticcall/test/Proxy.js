const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('Proxy test', () => {
    let owner, library, proxy;
    before(async () => {
        [owner] = await ethers.getSigners();

        const Library = await ethers.getContractFactory('Library');
        library = await Library.deploy(125);

        const Proxy = await ethers.getContractFactory('Proxy');
        proxy = await Proxy.deploy(library.target);

    })

    describe('staticcall', () => {
        it('Get the value through staticcall', async () => {
            const proxyAsOwner = proxy.connect(owner);

            expect(await proxyAsOwner.libraryAddress()).to.equal(library.target);

            const proxyValue = await proxyAsOwner.getValue();
            expect(proxyValue).to.equal(125);
        })
    });
})