// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./INFT.sol";

contract EthBridgeService {
    mapping(address => mapping(uint256 => bool)) public processedNonces;
    mapping(string => bool) public metadataUsed;
    INFT public coll;

    event MintETH(
        address from,
        address to,
        address collection,
        string tokenURI
    );

    function mint(
        uint256 nonce,
        address collection,
        address receiver,
        string memory tokenURI,
        bytes calldata signature
    ) public {
        bytes32 message = prefixed(
            keccak256(abi.encodePacked(msg.sender, collection, tokenURI, nonce))
        );
        require(metadataUsed[tokenURI] == false, "This metadata already minting");
        require(recoverSigner(message, signature) == receiver, "wrong signature");
        require(
            processedNonces[receiver][nonce] == false,
            "transfer already processed"
        );
        processedNonces[receiver][nonce] = true;

        coll = INFT(collection);
        coll.mintNFT(receiver, tokenURI);
        metadataUsed[tokenURI] = true;
        emit MintETH(msg.sender, receiver, collection, tokenURI);
    }

   function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
            );
    }

    function recoverSigner(bytes32 message, bytes memory sig)
        internal
        pure
        returns (address)
    {
        uint8 v;
        bytes32 r;
        bytes32 s;
        (v, r, s) = splitSignature(sig);
        return ecrecover(message, v, r, s);
    }

    function splitSignature(bytes memory sig)
        internal
        pure
        returns (
            uint8,
            bytes32,
            bytes32
        )
    {
        require(sig.length == 65);
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }
        return (v, r, s);
    }
}
