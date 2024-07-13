const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('EVM Storage tests', () => {
    let singleSlot
    before(async () => {
        // const SingleSlot = await ethers.getContractFactory('EVMStorageSingleSlot');
        // singleSlot = await SingleSlot.deploy();
    });

    describe('Single Slot', () => {
        beforeEach(async () => {
            const SingleSlot = await ethers.getContractFactory('EVMStorageSingleSlot');
            singleSlot = await SingleSlot.deploy();
        });

        it('SStore test #1', async () => {
            const tx = await singleSlot.sstore();
            await tx.wait();

            const s_x_value = await singleSlot.s_x();
            const s_y_value = await singleSlot.s_y();
            const s_z_value = await singleSlot.s_z();
            expect(s_x_value).to.equal(111);
            expect(s_y_value).to.equal(222);
            expect(s_z_value).to.equal("0x0000000000000000000000000000000000000000000000000000000000ababab");
        })

        it('SStore test #2', async() => {
            const tx = await singleSlot.sstore_new();
            await tx.wait()

            const s_x_value = await singleSlot.s_x();
            const s_y_value = await singleSlot.s_y();
            const s_z_value = await singleSlot.s_z();
            expect(s_x_value).to.equal(123);
            expect(s_y_value).to.equal(456);
            expect(s_z_value).to.equal("0x0000000000000000000000000000000000000000000000000000000000cdcdcd");
        })

        it('Sload test #1', async() => {
            let [s_x_value, s_y_value, s_z_value] = await singleSlot.sload();

            expect(s_x_value).to.equal(0);
            expect(s_y_value).to.equal(0);
            expect(s_z_value).to.equal("0x0000000000000000000000000000000000000000000000000000000000000000")

            let tx = await singleSlot.sstore();
            await tx.wait();

            [s_x_value, s_y_value, s_z_value] = await singleSlot.sload();

            expect(s_x_value).to.equal(111);
            expect(s_y_value).to.equal(222);
            expect(s_z_value).to.equal("0x0000000000000000000000000000000000000000000000000000000000ababab");

            tx = await singleSlot.sstore_new();
            await tx.wait();

            [s_x_value, s_y_value, s_z_value] = await singleSlot.sload();

            expect(s_x_value).to.equal(123);
            expect(s_y_value).to.equal(456);
            expect(s_z_value).to.equal("0x0000000000000000000000000000000000000000000000000000000000cdcdcd");
        })

        it('Sload test #2', async() => {
            let [s_x_value, s_y_value, s_z_value] = await singleSlot.sload_new();

            expect(s_x_value).to.equal(0);
            expect(s_y_value).to.equal(0);
            expect(s_z_value).to.equal("0x0000000000000000000000000000000000000000000000000000000000000000")

            let tx = await singleSlot.sstore();
            await tx.wait();

            [s_x_value, s_y_value, s_z_value] = await singleSlot.sload();

            expect(s_x_value).to.equal(111);
            expect(s_y_value).to.equal(222);
            expect(s_z_value).to.equal("0x0000000000000000000000000000000000000000000000000000000000ababab");

            tx = await singleSlot.sstore_new();
            await tx.wait();

            [s_x_value, s_y_value, s_z_value] = await singleSlot.sload();

            expect(s_x_value).to.equal(123);
            expect(s_y_value).to.equal(456);
            expect(s_z_value).to.equal("0x0000000000000000000000000000000000000000000000000000000000cdcdcd");
        })

    })
})