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

    function sstore() public {
        assembly {
            sstore(0, 111)
            sstore(1, 222)
            sstore(2, 0xababab)
        }
    }

    function sstore_new() public {
        assembly {
            sstore(s_x.slot, 123)
            sstore(s_y.slot, 456)
            sstore(s_z.slot, 0xcdcdcd)
        }
    }

    function sload() public view returns (uint256 x, uint256 y, bytes32 z){
        assembly {
            x := sload(0)
            y := sload(1)
            z := sload(2)
        }
    }

    function sload_new() public view returns (uint256 x, uint256 y, bytes32 z){
        assembly {
            x := sload(s_x.slot)
            y := sload(s_y.slot)
            z := sload(s_z.slot)
        }
    }
}

contract BitMasking {
    // |        256 bits        |
    // 000 ... 000 | 111 ... 111

    function mask() public pure returns (bytes32 mask) {
        assembly {
            mask := sub(shl(16, 1), 1)
        }
    }

    function shift_mask() public pure returns (bytes32 mask) {
        assembly {
            mask := shl(32, sub(shl(16, 1), 1))
        }
    }

    function not_mask() public pure returns (bytes32 mask) {
        assembly {
            mask := not(shl(32, sub(shl(16, 1), 1)))
        }
    }
}

contract EVMStoragePackedSlotBytes {
    // slot 0 (packed right to left)
    // 0x000000 ... 00000000
    
    //0x000000...abababab
    bytes4 public b4 = 0xabababab;
    //0x000000..cdcdabababab
    bytes2 public b2 = 0xcdcd;
    // 0x0000000000000000000000000000000000000000000000000000cdcdabababab
    //
}

contract EVMStoragePackedSlot {
    // Data < 32 bytes are packed into a slot
    // Bit masking
    // slot, offset

    // slot0
    uint128 public s_a;
    uint64 public s_b;
    uint32 public s_c;
    uint32 public s_d;

    // slot1
    address public s_addr; // 20 bytes = 160bits
    // 96 bits
    uint64 public s_x;
    uint32 public s_y;

    function sstore() public {
        assembly {
            let v:= sload(0)

            // s_d | s_c | s_b | s_a
            // 32  | 32  | 64  | 128

            sstore(0, v)
        }
    }
}