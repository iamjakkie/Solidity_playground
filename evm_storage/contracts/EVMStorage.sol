pragma solidity ^0.8.24;

contract EVMStorageSingleSlot {
    // 2 ** 256 slots, each slot can store 32 bytes
    // Slots are assigned in the order of the state variables are declared
    // Data < 32 bytes are packed into a single slot
    // sstore(k, v) - store v to slot k
    // sload(k) - load 32 bytes from slot k

    uint256 public s_x; // slot 0
    uint256 public s_y; // slot 1
    bytes32 public s_z; // slot 2

    function test_sstore() public {
        assembly {
            sstore(0, 111)
            sstore(1, 222)
            sstore(2, 0xababab)
        }
    }

    function test_sstore_new() public {
        assembly {
            sstore(s_x.slot, 123)
            sstore(s_y.slot, 456)
            sstore(s_z.slot, 0xcdcdcd)
        }
    }

    function test_sload() public view returns (uint256 x, uint256 y, bytes32 z){
        assembly {
            x := sload(0)
            y := sload(1)
            z := sload(2)
        }
    }
}