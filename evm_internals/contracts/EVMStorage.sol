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

contract EVMStorageMapping {
    // mapping(key => value)
    // slot of value = keccak256(key, slow where mapping is declared)

    mapping(address => uint256) public map;

    address public constant ADDR_1 = address(1);
    address public constant ADDR_2 = address(2);
    address public constant ADDR_3 = address(3);

    constructor() {
        map[ADDR_1] = 11;
        map[ADDR_2] = 22;
        map[ADDR_3] = 33;
    }

    function get_value(address key) public view returns (uint256 v) {
        bytes32 slot_v = keccak256(abi.encode(key, uint256(0)));
        assembly {
            v := sload(slot_v)
        }
    }
}

contract EVMStorageNestedMapping {
    // key => val
    // slot of value = keccak256(key, slot where mapping is declared)
    // key0 => key1 => val
    // slot of value = keccak256(key1, keccak256(key0, slot where mapping is declared))
    
    // addr0 => addr1 => val
    // keccak256(addr, keccak256(addr, 0))
    mapping(address => mapping(address => uint256)) public map;

    address public constant ADDR_1 = address(1);
    address public constant ADDR_2 = address(2);
    address public constant ADDR_3 = address(3);

    constructor() {
        map[ADDR_1][ADDR_2] = 11;
        map[ADDR_2][ADDR_3] = 22;
        map[ADDR_3][ADDR_1] = 33;
    }

    function get_value(address key0, address key1) public view returns (uint256 v) {
        bytes32 s0 = keccak256(abi.encode(key0, uint256(0)));
        bytes32 s1 = keccak256(abi.encode(key1, s0));

        assembly {
            v := sload(s1)
        }
    }
}

contract EVMStorageMappingArray {
    // mapping(key => dynamic array (32 bytes elements))

    // mapping(key => 32 bytes)
    // slot of value in a mapping = keccak256(key, slot)

    // dynamic array of 32 bytes elements
    // slot of array element = keccak25(slot) + index

    // mapping -> array
    // slot where the dynamic array is declared = keccak256(key, slot)

    // slot of array element = keccak256(keccak256(key, slot)) + index

    mapping(address => uint256[]) public map;

    address public constant ADDR_1 = address(1);
    address public constant ADDR_2 = address(2);

    constructor() {
        map[ADDR_1].push(11);
        map[ADDR_1].push(22);
        map[ADDR_1].push(33);
        map[ADDR_2].push(44);
        map[ADDR_2].push(55);
        map[ADDR_2].push(66);
    }

    function get_map_array_val(address addr, uint256 i) public view returns (uint256 v, uint256 len) {
        // slot of array element = keccak256(keccak256(key, slot of map)) + index
        uint256 map_slot = 0;
        bytes32 map_hash = keccak256(abi.encode(addr, map_slot));
        bytes32 arr_hash = keccak256(abi.encode(map_hash));

        assembly {
            v := sload(add(arr_hash, i))
            len := sload(map_hash)
        }
    }
}

contract EVMStorageDynamicArrayStruct {
    // takes 2 slots in total per entry
    struct Point {
        uint256 x; // 1 slot
        uint128 y; // 0.5 slot
        uint128 z; // 0.5 slot
    }

    // slot of element = keccak256(slot where array is declared) + index of element
    // keccak256(0) + index of element * 2 slots
    Point[] private arr;

    constructor() {
        arr.push(Point(11, 22, 33));
        arr.push(Point(44, 55, 66));
        arr.push(Point(77, 88, 99));
    }

    function get_arr_struct_at(uint256 i) public view returns (uint256 x, uint128 y, uint128 z, uint256 len) {
        // slot of element = keccak256(0) + size of element * index of element
        bytes32 start = keccak256(abi.encode(uint256(0)));

        assembly {
            len := sload(0)
            // x
            // z | y
            x := sload(add(start, mul(i, 2)))
            let zy := sload(add(start, add(mul(2, i), 1)))
            z := shr(128, zy)
            y := zy
        }
    }
}