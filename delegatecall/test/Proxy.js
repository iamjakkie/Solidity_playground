const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('Proxy test', () => {
    let owner, library, proxy;
    beforeEach(async () => {
        owner = await ethers.getSigners();

        const Library = await ethers.getContractFactory('Library');
        library = await Library.deploy();

        const Proxy = await ethers.getContractFactory('Proxy');
        proxy = await Proxy.deploy(library.target);

    })

    describe('delegatecall', () => {
        it('Set the value through delegatecall', async () => {
            const proxyWithOwner = proxy.connect(owner);

        // Encode the function call to setValue
        const setValueAbi = ["function setValue(uint256 _value)"];
        const setValueIface = new ethers.utils.interface(setValueAbi);
        const data = setValueIface.encodeFunctionData("setValue", [42]);

        // Send the transaction to the proxy's fallback function
        const tx = await proxyWithOwner.fallback({ data });
        await tx.wait();

        // Check if the value was correctly set in the proxy contract's storage
        const value = await proxy.value();
        expect(value).to.equal(42);
        })
    });
})