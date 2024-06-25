// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenVault {
    address public owner;
    IERC20 public token;

    mapping(address => uint256) public balances;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event Trade(address indexed seller, address indexed buyer, uint256 amount, uint256 price);

    constructor(address tokenAddress) {
        owner = msg.sender;
        token = IERC20(tokenAddress);
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        balances[msg.sender] += amount;
        emit Deposit(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        require(token.transfer(msg.sender, amount), "Token transfer failed");
        emit Withdraw(msg.sender, amount);
    }

    function trade(address buyer, uint256 amount, uint256 price) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        uint256 tradeValue = amount * price;
        require(token.transferFrom(buyer, msg.sender, tradeValue), "Payment transfer failed");
        balances[msg.sender] -= amount;
        balances[buyer] += amount;
        emit Trade(msg.sender, buyer, amount, price);
    }
}