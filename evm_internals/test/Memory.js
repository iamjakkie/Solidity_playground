const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('EVM Memory tests', () => {
    describe('Basics', () => {
        let basics

        beforeEach(async () => {
            const Basics = await ethers.getContractFactory('MemBasic');
            basics = await Basics.deploy();
        });

        it('Mload test', async () => {
            const b32 = await basics.check();
            expect(b32).to.equal("0x0000000000000000000000000000000000000000000000000000000000ababab");
        })
    })

    describe('Gas costs', () => {
        let exp

        beforeEach(async () => {
            const Exp = await ethers.getContractFactory('MemExp');
            exp = await Exp.deploy();
        });

        it('Gas costs', async () => {
            const gas_used_0 = await exp.alloc_mem(0);
            expect(gas_used_0).to.equal(122);

            const gas_used_1 = await exp.alloc_mem(1);
            expect(gas_used_1).to.equal(180);
        })
    })

    describe('Memory struct', () => {
        let memStruct

        beforeEach(async () => {
            const MemStruct = await ethers.getContractFactory('MemStruct');
            memStruct = await MemStruct.deploy();
        });

        it('Read data from memory', async () => {
            const [x, y, z] = await memStruct.read();

            expect(x).to.equal(1);
            expect(y).to.equal(2);
            expect(z).to.equal(3);
        })

        it("Write data to memory", async() => {
            const [ptr, x, y, z] = await memStruct.write();

            expect(ptr).to.equal("0x00000000000000000000000000000000000000000000000000000000000000e0");
            expect(x).to.equal(11);
            expect(y).to.equal(22);
            expect(z).to.equal(33);
        })
    })

    describe('Memory fixed array', () => {
        let memFixedArray

        beforeEach(async () => {
            const MemFixArray = await ethers.getContractFactory('MemFixedArray');
            memFixedArray = await MemFixArray.deploy();
        });

        it('Read data from memory', async () => {
            const [a0, a1, a2] = await memFixedArray.read();

            expect(a0).to.equal(1);
            expect(a1).to.equal(2);
            expect(a2).to.equal(3);
        })

        it('Write data into memory', async () => {
            const [a0, a1, a2] = await memFixedArray.write();

            expect(a0).to.equal(11);
            expect(a1).to.equal(22);
            expect(a2).to.equal(33);
        })

    })

    describe('Memory dynamic array', () => {
        let memDynamicArray

        beforeEach(async () => {
            const MemDynamicArray = await ethers.getContractFactory('MemDynamicArray');
            memDynamicArray = await MemDynamicArray.deploy();
        });

        it('Read data from memory', async () => {
            const [p, len, a0, a1, a2, a3, a4] = await memDynamicArray.read();

            expect(p).to.equal("0x0000000000000000000000000000000000000000000000000000000000000080");
            expect(len).to.equal(5);
            
            expect(a0).to.equal(11);
            expect(a1).to.equal(22);
            expect(a2).to.equal(33);
            expect(a3).to.equal(44);
            expect(a4).to.equal(55);
        })

        it('Read data from memory', async () => {
            const [p, arr] = await memDynamicArray.write();
            const [a0, a1, a2] = arr;

            expect(p).to.equal("0x0000000000000000000000000000000000000000000000000000000000000080");
            
            expect(a0).to.equal(11);
            expect(a1).to.equal(22);
            expect(a2).to.equal(33);
        })

    })
})