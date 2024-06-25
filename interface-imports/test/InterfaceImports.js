const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), 'ether')
}

const ether = tokens
const shares = ether

describe('TokenVault', () => {
  let accounts,
      deployer,
      liquidityProvider,
      investor1,
      investor2

  let token,
      tv

  beforeEach(async () => {
    // Setup Accounts
    accounts = await ethers.getSigners()
    deployer = accounts[0]
    investor1 = accounts[1]
    investor2 = accounts[2]

    // Deploy Token
    const Token = await ethers.getContractFactory('Token')
    token = await Token.deploy('Test Token', 'TEST', tokens('1000000')) // 1 Million Tokens

    // Send tokens to investor1
    let transaction = await token.connect(deployer).transfer(investor1.address, tokens(100000))
    await transaction.wait()

    // Send token to investor2
    transaction = await token.connect(deployer).transfer(investor2.address, tokens(100000))
    await transaction.wait()

    // Deploy TokenVault
    const TV = await ethers.getContractFactory('TokenVault')
    tv = await TV.deploy(token.target)
  })

    describe('Deployment', () => {
        it('Should set the right token addresses', async () => {
            expect(await tv.token()).to.equal(token.target)
        })

        it('Should set the right owner', async () => {
            expect(await tv.owner()).to.equal(deployer.address)
        })

        it('Should set the right balance', async () => {
            expect(await token.balanceOf(tv.target)).to.equal(tokens(0))
        })
    })

    describe('Deposit', () => {
        it('Should deposit tokens', async () => {
            // Deposit tokens
            let transaction = await token.connect(investor1).approve(tv.target, tokens(1000))
            await transaction.wait()

            transaction = await tv.connect(investor1).deposit(tokens(1000))
            await transaction.wait()

            // Check balance
            expect(await token.balanceOf(tv.target)).to.equal(tokens(1000))
        })

        it('Should not deposit tokens if not approved', async () => {
            // Deposit tokens
            await expect(tv.connect(investor1).deposit(tokens(1000))).to.be.reverted
        })
    })

})