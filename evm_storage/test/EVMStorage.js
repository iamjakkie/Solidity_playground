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

        it('Get multiple slots struct', async() => {
            const [a_value, b_value, c_value] = await storageStruct.get_multiple_slots_struct();

            expect(a_value).to.equal(11);
            expect(b_value).to.equal(22);
            expect(c_value).to.equal(33);
        })
    })

    describe('Storage constants', async() => {
        let storageConstant
        beforeEach(async () => {
            const StorageConstant = await ethers.getContractFactory('EVMStorageConstants');
            storageConstant = await StorageConstant.deploy();
        });

        it('Verify slots dont store constants', async() => {
            const [v_0, v_1] = await storageConstant.get_slots()

            expect(v_0).to.equal(1);
            expect(v_1).to.equal(2);
        })

    })

    describe('Storage Fixed array', async() => {
        let fixedArray
        beforeEach(async () => {
            const FixedArray = await ethers.getContractFactory('EVMStorageFixedArray');
            fixedArray = await FixedArray.deploy();
        });

        it('Verify arr 0 values', async() => {
            const val_0 = await fixedArray.get_arr0(0);
            const val_1 = await fixedArray.get_arr0(1);
            const val_2 = await fixedArray.get_arr0(2);
            
            expect(val_0).to.equal(1);
            expect(val_1).to.equal(2);
            expect(val_2).to.equal(3);

        })

        it('Verify arr 1 values', async() => {
            const val_0 = await fixedArray.get_arr1(0);
            const val_1 = await fixedArray.get_arr1(1);
            const val_2 = await fixedArray.get_arr1(2);
            
            expect(val_0).to.equal(4);
            expect(val_1).to.equal(5);
            expect(val_2).to.equal(6);

        })

        it('Verify arr 2 values', async() => {
            const val_0 = await fixedArray.get_arr2(0);
            const val_1 = await fixedArray.get_arr2(1);
            const val_2 = await fixedArray.get_arr2(2);
            const val_3 = await fixedArray.get_arr2(3);
            const val_4 = await fixedArray.get_arr2(4);
            const val_5 = await fixedArray.get_arr2(5);
            
            expect(val_0).to.equal(7);
            expect(val_1).to.equal(8);
            expect(val_2).to.equal(9);
            expect(val_3).to.equal(10);
            expect(val_4).to.equal(11);
            expect(val_5).to.equal(0);

        })

    })

    describe('Storage Dynamic array', async() => {
        let dynamicArray
        beforeEach(async () => {
            const DynamicArray = await ethers.getContractFactory('EVMStorageDynamicArray');
            dynamicArray = await DynamicArray.deploy();
        });

        it('Verify arr values', async() => {
            const [arr_val_0, arr_b32_0, len] = await dynamicArray.get_arr_val(0, 0);

            expect(arr_val_0).to.equal(11);
            expect(arr_b32_0).to.equal("0x000000000000000000000000000000000000000000000000000000000000000b");
            expect(len).to.equal(3);

            const [arr_val_1, arr_b32_1, ] = await dynamicArray.get_arr_val(0, 1);

            expect(arr_val_1).to.equal(22);
            expect(arr_b32_1).to.equal("0x0000000000000000000000000000000000000000000000000000000000000016");
            
            const [arr_val_2, arr_b32_2, ] = await dynamicArray.get_arr_val(0, 2);

            expect(arr_val_2).to.equal(33);
            expect(arr_b32_2).to.equal("0x0000000000000000000000000000000000000000000000000000000000000021");
            
        })

    })

    describe('Storage Mapping', async() => {
        let mapping
        beforeEach(async () => {
            const Mapping = await ethers.getContractFactory('EVMStorageMapping');
            mapping = await Mapping.deploy();
        });

        it('Verify')

    })
})