require("dotenv").config();

const userAccountId = process.env.HBAR_USER_ID;
const userPK = process.env.HBAR_USER_KEY;
let tokenId = "0.0.298965";

exports.getUser = function() {
  return {
    accountId: userAccountId,
    key: userPK
  }
}
exports.getBridgeHederaLock = function () {
  return {
    network: "hedera",
    accountId: '0.0.26556813',
    tokenId: '0.0.34745959',
    serial: 1
  };
};

exports.getEthMintMessage = function () {
  return {
    network: 'eth',
    metadata: 'ipfs://bafybeigiqknw2jzef35qdsf4jxjbm6oqj6p764qei3mce7bpt67ty4pq2i/metadata/5.json',
    account: '0xB9E5F5ACDb4aF82ABbdD4456227860A2e2353198',
  }
}

exports.getEthMintTx = function () {
  return {
    network: 'eth',
    project: 'gray_freshman',
    metadata: 'ipfs://bafybeigiqknw2jzef35qdsf4jxjbm6oqj6p764qei3mce7bpt67ty4pq2i/metadata/5.json',
    account: '0xB9E5F5ACDb4aF82ABbdD4456227860A2e2353198',
    signature: '0xc36ff9c73de19c51c99121c690cca93936020e4392a4cc9bf0e3935a49045c7e5945139149ed0a85c2e400abf98cca4ab0f50d726e1ad868907b18e94a61b1551c'
  }
}

