const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('Proxy test', () => {
    let owner;
    beforeEach(async () => {
        owner = await ethers.getSigners();
    })
})