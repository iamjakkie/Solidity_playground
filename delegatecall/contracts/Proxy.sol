// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Proxy {
    address public libraryAddress;
    uint256 public value;

    constructor(address _libraryAddress) {
        libraryAddress = _libraryAddress;
    }

    function setValue(uint256 _value) public {
        (bool success, ) = libraryAddress.delegatecall(
            abi.encodeWithSignature("setValue(uint256)", _value)
        );
        require(success, "Error setting value");
    }

    function setLibraryAddress(address _libraryAddress) public {
        libraryAddress = _libraryAddress;
    }
}
