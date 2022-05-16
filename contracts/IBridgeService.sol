// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.11;

interface IBridgeService {
    function lock(address tokenAddress, int64 serialNumber) payable external returns (int responseCode);
    function withdraw(address tokenAddress, int64 serialNumber) external returns (int responseCode);
}