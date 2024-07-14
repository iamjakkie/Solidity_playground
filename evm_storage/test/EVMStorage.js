const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('EVM Storage tests', () => {
    // before(async () => {
    //     // const SingleSlot = await ethers.getContractFactory('EVMStorageSingleSlot');
    //     // singleSlot = await SingleSlot.deploy();
    // });

    describe('Single Slot', () => {
        let singleSlot

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

    describe('BitMasking', () => {
        let bitMasking
        beforeEach(async () => {
            const BitMasking = await ethers.getContractFactory('BitMasking');
            bitMasking = await BitMasking.deploy();
        });

        it('Test Mask', async() => {
            const mask = await bitMasking.mask();

            expect(mask).to.equal("0x000000000000000000000000000000000000000000000000000000000000ffff");
        })

        it('Test Shift Mask', async() => {
            const shift_mask = await bitMasking.shift_mask();

            expect(shift_mask).to.equal("0x0000000000000000000000000000000000000000000000000000ffff00000000")
        })

        it('Not Mask', async() => {
            const not_mask = await bitMasking.not_mask();

            expect(not_mask).to.equal("0xffffffffffffffffffffffffffffffffffffffffffffffffffff0000ffffffff")
        })
    })
})