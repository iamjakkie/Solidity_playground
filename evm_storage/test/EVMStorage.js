const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('EVM Storage tests', () => {
    let singleSlot
    before(async () => {
        // const SingleSlot = await ethers.getContractFactory('EVMStorageSingleSlot');
        // singleSlot = await SingleSlot.deploy();
    });

    describe('Single Slot', () => {
        before(async () => {
            const SingleSlot = await ethers.getContractFactory('EVMStorageSingleSlot');
            singleSlot = await SingleSlot.deploy();
        });

        it('SStore test #1', async () => {
            const tx = await singleSlot.test_sstore();

            const s_x_value = await singleSlot.s_x();
            const s_y_value = await singleSlot.s_y();
            const s_z_value = await singleSlot.s_z();
            expect(s_x_value).to.equal(111);
            expect(s_y_value).to.equal(222);
            expect(s_z_value).to.equal("0x0000000000000000000000000000000000000000000000000000000000ababab");
        })

    })
})