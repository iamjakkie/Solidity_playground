pragma solidity ^0.8.24;

contract MemBasic {
    // mstore(p, v) = store 32 bytes to memory starting at location p
    // mload(p) = load 32 bytes from memory starting at location p

    function check() public pure returns (bytes32 b32) {
        assembly {
            let p := mload(0x40)
            mstore(p, 0xababab)
            b32 := mload(p)
        }
    }
}

contract MemExp {
    function alloc_mem(uint256 n) external view returns (uint256) {
        uint256 gas_start = gasleft();
        uint256[] memory arr = new uint256[](n);
        uint256 gas_end = gasleft();
        return gas_start - gas_end;
    }
}