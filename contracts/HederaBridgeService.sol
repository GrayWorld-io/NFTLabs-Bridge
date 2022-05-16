// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.11;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/Counters.sol";

import "./hip-206/HederaTokenService.sol";
import "./hip-206/HederaResponseCodes.sol";
import "./IBridgeService.sol";

contract HederaBridgeService is HederaTokenService, IBridgeService {
    using Counters for Counters.Counter;
    uint public index;

    struct TokenInfo {
        address tokenAddress;
        int64 tokenId;
        address owner;
    }
    mapping(uint => TokenInfo) public tokenOwner;

    constructor() {
        index = 0;
    }

    function lock(address tokenAddress, int64 serialNumber)
        public
        payable
        override
        returns (int256 response)
    {
        int256 res = HederaTokenService.transferNFT(
            tokenAddress,
            msg.sender,
            address(this),
            serialNumber
        );
        if (res != HederaResponseCodes.SUCCESS) {
            revert("Transfer Failed");
        }

        tokenOwner[index] = TokenInfo(
            tokenAddress,
            serialNumber,
            msg.sender
        );
        index++;

        return 1;
    }

    function withdraw(address tokenAddress, int64 serialNumber)
        public
        virtual
        override
        returns (int256 response)
    {
        int256 res = HederaTokenService.transferNFT(
            tokenAddress,
            address(this),
            msg.sender,
            serialNumber
        );
        if (res != HederaResponseCodes.SUCCESS) {
            revert("Transfer Failed");
        }
        for (uint i = 0; i < index; i++) {
            TokenInfo storage token = tokenOwner[i];
            if (token.owner == msg.sender && token.tokenId == serialNumber) {
                tokenOwner[i] = TokenInfo(
                address(0),
                0,
                msg.sender
                );
            }
        }
        index--;
        return 1;
    }

    function getAssets(address owner)
        public
        view
        returns (TokenInfo[] memory)
    {
      TokenInfo[] memory assets = new TokenInfo[](index);
      uint j = 0;
      for (uint i = 0; i < index; i++) {
          TokenInfo storage token = tokenOwner[i];
          if (token.owner == owner) {
            assets[j] = token;    
            j++;
          }
      }
      return assets;
    }
}
