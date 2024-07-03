// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Proxy {
    address public libraryAddress;
    uint256 public value;

    constructor(address _libraryAddress) {
        libraryAddress = _libraryAddress;
    }

    fallback() external payable {
        (bool success, ) = libraryAddress.delegatecall(msg.data);
        require(success, "DELEGATECALL failed");
    }

    function setLibraryAddress(address _libraryAddress) public {
        libraryAddress = _libraryAddress;
    }
}
