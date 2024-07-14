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

    describe('Single slot packed variables', () => {
        let packedSlot
        beforeEach(async () => {
            const PackedSlot = await ethers.getContractFactory('EVMStoragePackedSlot');
            packedSlot = await PackedSlot.deploy();
        });

        it('Test sstore', async () => {
            await packedSlot.sstore();

            const s_a_value = await packedSlot.s_a();
            const s_b_value = await packedSlot.s_b();
            const s_c_value = await packedSlot.s_c();
            const s_d_value = await packedSlot.s_d();

            expect(s_a_value).to.equal(11);
            expect(s_b_value).to.equal(22);
            expect(s_c_value).to.equal(33);
            expect(s_d_value).to.equal(44);
            
        })

        it('Test offsets', async() => {
            const offsets = await packedSlot.slot0_offset();
            const [s_a_offset, s_b_offset, s_c_offset, s_d_offset] = offsets;

            expect(s_a_offset).to.equal(0);
            expect(s_b_offset).to.equal(16);
            expect(s_c_offset).to.equal(24);
            expect(s_d_offset).to.equal(28);

        })

        it('Test sstore offset', async () => {
            await packedSlot.sstore_offset();

            const s_a_value = await packedSlot.s_a();
            const s_b_value = await packedSlot.s_b();
            const s_c_value = await packedSlot.s_c();
            const s_d_value = await packedSlot.s_d();

            expect(s_a_value).to.equal(11);
            expect(s_b_value).to.equal(22);
            expect(s_c_value).to.equal(33);
            expect(s_d_value).to.equal(44);
            
        })
    })

    describe('Storage structs', async() => {
        let storageStruct
        beforeEach(async () => {
            const StorageStruct = await ethers.getContractFactory('EVMStorageStruct');
            storageStruct = await StorageStruct.deploy();
        });

        it('Get single slot struct', async() => {
            const [x_value, y_value, z_value] = await storageStruct.get_single_slot_struct();
            
            expect(x_value).to.equal(1);
            expect(y_value).to.equal(2);
            expect(z_value).to.equal(3);
        })
    })
})