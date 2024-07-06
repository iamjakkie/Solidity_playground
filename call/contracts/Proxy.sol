// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Proxy {
    address public libraryAddress;
    uint256 public value;

    constructor(address _libraryAddress) {
        libraryAddress = _libraryAddress;
    }

    function callIncrement() public returns (bool, bytes memory){
        (bool success, bytes memory data) = libraryAddress.call(
            abi.encodeWithSignature("increment()")
        );
        return (success, data);
    }
}
