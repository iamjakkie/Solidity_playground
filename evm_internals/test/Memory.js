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
})