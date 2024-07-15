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

    function sload() public view returns (uint256 x, uint256 y, bytes32 z) {
        assembly {
            x := sload(0)
            y := sload(1)
            z := sload(2)
        }
    }

    function sload_new() public view returns (uint256 x, uint256 y, bytes32 z) {
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
            let v := sload(0)

            // set s_a = 11
            // s_d | s_c | s_b | s_a
            // 32  | 32  | 64  | 128

            let mask_a := not(sub(shl(128, 1), 1))
            v := and(v, mask_a)
            v := or(v, 11)

            // set s_b = 22
            let mask_b := not(shl(128, sub(shl(64, 1), 1)))
            v := and(v, mask_b)
            v := or(v, shl(128, 22))
            sstore(0, v)

            // set s_c = 33
            let mask_c := not(shl(192, sub(shl(32, 1), 1)))
            v := and(v, mask_c)
            v := or(v, shl(192, 33))
            sstore(0, v)

            // set s_d = 44
            let mask_d := not(shl(224, sub(shl(32, 1), 1)))
            v := and(v, mask_d)
            v := or(v, shl(224, 44))
            sstore(0, v)
        }
    }

    function slot0_offset()
        public
        pure
        returns (
            uint256 a_offset,
            uint256 b_offset,
            uint256 c_offset,
            uint256 d_offset
        )
    {
        assembly {
            a_offset := s_a.offset // 0 = 0 * 8 = 0 bits
            b_offset := s_b.offset // 16 = 16 * 8 = 128 bits
            c_offset := s_c.offset // 24 = 24 * 8 = 192 bits
            d_offset := s_d.offset // 28 = 28 * 8 = 224 bits
        }
    }

    function sstore_offset() public {
        assembly {
            let v := sload(s_a.slot)

            // set s_a = 11
            // s_d | s_c | s_b | s_a
            // 32  | 32  | 64  | 128

            let mask_a := not(sub(shl(128, 1), 1))
            v := and(v, mask_a)
            v := or(v, 11)

            // set s_b = 22
            let mask_b := not(shl(mul(s_b.offset, 8), sub(shl(64, 1), 1)))
            v := and(v, mask_b)
            v := or(v, shl(mul(s_b.offset, 8), 22))
            sstore(0, v)

            // set s_c = 33
            let mask_c := not(shl(mul(s_c.offset, 8), sub(shl(32, 1), 1)))
            v := and(v, mask_c)
            v := or(v, shl(mul(s_c.offset, 8), 33))
            sstore(0, v)

            // set s_d = 44
            let mask_d := not(shl(mul(s_d.offset, 8), sub(shl(32, 1), 1)))
            v := and(v, mask_d)
            v := or(v, shl(mul(s_d.offset, 8), 44))
            sstore(0, v)
        }
    }
}

contract EVMStorageStruct {
    struct SingleSlot {
        uint128 x;
        uint64 y;
        uint64 z;
    }

    struct MultipleSlots {
        uint256 a; // slot1
        uint256 b; // slot2
        uint256 c; // slot3
    }

    // slot0
    SingleSlot public single = SingleSlot({x: 1, y: 2, z: 3});

    // slot1
    MultipleSlots public multi = MultipleSlots({a: 11, b: 22, c: 33});

    function get_single_slot_struct() public view returns (uint128 x, uint64 y, uint64 z) {
        assembly {
            let s := sload(0)

            x := s
            y := shr(128, s)
            z := shr(192, s)
        }
    }

    function get_multiple_slots_struct() public view returns (uint256 a, uint256 b, uint256 c) {
        assembly {
            a := sload(1)
            b := sload(2)
            c := sload(3)
        }
    }
}

contract EVMStorageConstants {
    // constants and immutables don't use storage
    // slot0
    uint256 public s0 = 1;
    uint256 constant X = 123;
    address public immutable owner;
    // slot1
    uint256 public s1 = 2;

    constructor() {
        owner = msg.sender;
    }

    function get_slots() public view returns (uint256 v0, uint256 v1) {
        assembly {
            v0 := sload(0)
            v1 := sload(1)
        }
    }
}

contract EVMStorageFixedArray {
    // Fixed array with <= 32 bytes elements
    // slot of element = slot where array is declared + index of array element

    // slot 0, slot 1, slot 3
    uint256[3] private arr_0 = [1,2,3];
    // slot 3, slot 4, slot 5
    uint256[3] private arr_1 = [4,5,6];
    // slot 6, slot 6, slot 7, slot 7, slot 8
    uint128[5] private arr_2 = [7,8,9,10,11];

    function get_arr0(uint256 i) public view returns (uint256 v) {
        assembly {
            v := sload(i)
        }
    }

    function get_arr1(uint256 i) public view returns (uint256 v) {
        assembly {
            v := sload(add(3, i))
        }
    }

    function get_arr2(uint256 i) public view returns (uint128 v) {
        assembly {
            let b32 := sload(add(6, div(i, 2)))

            // slot 6 = 1st element | 0th element
            // slot 7 = 3rd element | 2nd element
            // slot 8 = 000 ... 000 | 4th element

            // i is even => get right 128 bits => cast to uint128
            // i is odd => get left 128 bits => shift right 128 bits

            switch mod(i, 2)
            case 1 { v := shr(128, b32) }
            default { v := b32 }
        }
    }
}

contract EVMStorageDynamicArray {
    // slot of element = keccak256(slot where array is declared)
    //                   + size of element * index of element
    // keccak256(0), keccak256(0) + 1, keccak256(0) + 2
    uint256[] private arr = [11, 22, 33];
    // keccak256(1), keccak256(1), keccak256(1) + 1
    uint128[] private arr_2 = [1, 2, 3];

    function get_arr_val(uint256 slot, uint256 i) public view returns (uint256 val, bytes32 b32, uint256 len) {
        bytes32 start = keccak256(abi.encode(slot));
        assembly {
            len := sload(slot)
            val := sload(add(start, i))
            b32 := val
        }
    }
}