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
})