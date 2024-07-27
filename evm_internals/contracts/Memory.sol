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

contract MemStruct {
    // Memory data is not packed - stored in chunks of 32 bytes
    struct Point {
        uint256 x;
        uint32 y;
        uint32 z;
    }

    function read() public pure returns (uint256 x, uint256 y, uint256 z) {
        // Point is loaded to memory starting at 0x80
        // 0x80 - initial free memory
        Point memory p = Point(1, 2, 3);

        assembly {
            x := mload(0x80)
            y := mload(0xa0)
            z := mload(0xc0)
        }
    }

    function write()
        public
        pure
        returns (bytes32 free_mem_ptr, uint256 x, uint256 y, uint256 z)
    {
        Point memory p;

        assembly {
            mstore(0x80, 11)
            mstore(0xa0, 22)
            mstore(0xc0, 33)
            free_mem_ptr := mload(0x40)
        }

        x = p.x;
        y = p.y;
        z = p.z;
    }
}

contract MemFixedArray {
    function read() public pure returns (uint256 a0, uint256 a1, uint256 a2) {
        uint32[3] memory arr = [uint32(1), uint32(2), uint32(3)];

        assembly {
            a0 := mload(0x80)
            a1 := mload(add(0x80, 0x20))
            a2 := mload(add(0x80, mul(0x20, 2)))
        }
    }

    function write() public pure returns (uint256 a0, uint256 a1, uint256 a2) {
        uint32[3] memory arr;

        assembly {
            mstore(arr, 11)
            mstore(add(arr, 0x20), 22)
            mstore(add(arr, 0x40), 33)
        }

        a0 = arr[0];
        a1 = arr[1];
        a2 = arr[2];
    }
}

contract MemDynamicArray {
    function read()
        public
        pure
        returns (
            bytes32 p,
            uint256 len,
            uint256 a0,
            uint256 a1,
            uint256 a2,
            uint256 a3,
            uint256 a4
        )
    {
        uint256[] memory arr = new uint256[](5);
        arr[0] = uint256(11);
        arr[1] = uint256(22);
        arr[2] = uint256(33);
        arr[3] = uint256(44);
        arr[4] = uint256(55);

        assembly {
            p := arr
            len := mload(arr)

            a0 := mload(add(arr, 0x20))
            a1 := mload(add(arr, mul(0x20, 2)))
            a2 := mload(add(arr, mul(0x20, 3)))
            a3 := mload(add(arr, mul(0x20, 4)))
            a4 := mload(add(arr, mul(0x20, 5)))
        }
    }

    function write() public pure returns (bytes32 p, uint256[] memory) {
        uint256[] memory arr = new uint256[](0);

        assembly {
            p := arr
            mstore(arr, 3)
            mstore(add(arr, 0x20), 11)
            mstore(add(arr, 0x40), 22)
            mstore(add(arr, 0x60), 33)
            // update dynamic pointer
            mstore(0x40, add(arr, 0x80))
        }

        return (p, arr);
    }
}
