// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Proxy {
    address public libraryAddress;
    uint256 public value;

    constructor(address _libraryAddress) {
        libraryAddress = _libraryAddress;
    }

    function getValue() public view returns (uint256 value){
        (bool success, bytes memory data) = libraryAddress.staticcall(abi.encodeWithSignature("getValue()"));
        require(success, "Call to library failed");
        value = abi.decode(data, (uint256));
    }

    function setLibraryAddress(address _libraryAddress) public {
        libraryAddress = _libraryAddress;
    }
}
