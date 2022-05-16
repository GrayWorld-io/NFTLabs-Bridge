//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../INFT.sol";

contract ETHBridge {
    address[] supportContracts = [
        0xd9145CCE52D386f254917e481eB44e9943F39138
    ];
    INFT public coll;
    
    event MintETH (
        address from,
        address to,
        address collection,
        string tokenURI
    );

    function mint(address collection, address receiver, string memory tokenURI) public {
        coll = INFT(collection);
        coll.mintNFT(receiver, tokenURI);

        emit MintETH(msg.sender, receiver, collection, tokenURI);
    }
}
