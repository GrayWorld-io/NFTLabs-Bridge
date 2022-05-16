var freshManMintDB = require("../../models/hedera/freshman/mint");
var freshManMetadataDB = require("../../models/hedera/freshman/metadata");
var graySeminarMintDB = require("../../models/hedera/gray/seminar/mint");
var graySeminarMetadataDB = require("../../models/hedera/gray/seminar/metadata");
var hedera = require("../../hedera/hedera");
var hederaTokenController = require("./token");

var logger = require("../../utils/logger");

var hederaBridgeContract = require("../../hedera/contract");
var hedera = require("../../hedera/hedera");

var constants = require("../../lib/constants/constants_contract_info");
var topicIDConstants = require("../../lib/constants/constants_topic_info");
var resCode = require("../../lib/constants/constants_res_code");

// const FRESHMAN_MAX = 5;
// const SERIAL_START = 1;
// const FRESHMAN_TOKEN_ID = "0.0.34204880"
// const FRESHMAN_STORAGE = "ipfs"
// const FRESHMAN_MINT_PRICE = 2;

const SERIAL_START = constants.SERIAL_START;

const HEDERA_CONTRACT_ID = constants.HEDERA_CONTRACT_ID;

exports.getHederaWithdrawTx = async (req) => {
  let accountId = req.accountId;
  let tokenId = hedera.toSolidityAddress(req.tokenId);
  let serial = req.serial;

  let parameters = [tokenId, serial];
  let tx = await hederaBridgeContract.getContractCallTx(hedera.getClient(), false, accountId, HEDERA_CONTRACT_ID, "withdraw", parameters)
  return {
    code: resCode.SUCCESS,
    tx: tx.toBytes()
  }
}

exports.getHederaLockAssets = async (req) => {
  let accountId = req.accountId;
  let accountIdSolidityFormat = hedera.toAccountSolidityAddress(accountId);

  let parameters = [accountIdSolidityFormat];
  let res = await hederaBridgeContract.call(hedera.getClient(), HEDERA_CONTRACT_ID, "getAssets", parameters)
  console.log(res[0]);
  let list = [];
  for (let i = 0; i < res[0].length; i++) {
    var item = {
      tokenId: hedera.fromSolidityAddress(res[0][i][0]),
      serial: res[0][i][1],
      owner: hedera.fromAccountSolidityAddress(res[0][i][2])
    }
    let info = await hederaTokenController.getNFTInfo(item);
    item['metadata'] = 'ipfs://' + info.metadata;
    item['imageUrl'] = info.imageUrl;
    if (item.serial !== '0')
      list.push(item);
  }
  return {
    code: resCode.SUCCESS,
    list: list
  }
}

exports.getHederaLockTx = async (req) => {
  let accountId = req.accountId;
  console.log(hedera.toAccountSolidityAddress(accountId))
  let tokenId = hedera.toSolidityAddress(req.tokenId);
  let serial = req.serial;

  let parameters = [tokenId, serial];
  let tx = await hederaBridgeContract.getContractCallTx(hedera.getClient(), false, accountId, HEDERA_CONTRACT_ID, "lock", parameters)
  return {
    code: resCode.SUCCESS,
    tx: tx.toBytes()
  }
}

exports.sendHCSMessage = async (req) => {
  let topicId = '';
  let message = {};
  // if (req.type == 'HederaLockAndEthMint') {
  //   topicId = topicIDConstants.HEDERA_SWAP_TOPIC_ID;
  //   message = {
  //     owner: req.accountId,
  //     tokenId: req.tokenId,
  //     serial: req.serial,
  //     ethCollectionAddress: req.ethCollectionAddress,
  //     txId: req.txid
  //   }
  // } else if (req.type == 'EthBurnAndHederaUnLock') {

  // }
  topicId = topicIDConstants.HEDERA_SWAP_TOPIC_ID;
  message = {
    owner: req.accountId,
    tokenId: req.tokenId,
    serial: req.serial,
    ethCollectionAddress: req.ethCollectionAddress,
    txId: req.txid
  }  
  await hedera.sendHCSMessage(topicId, JSON.stringify(message))
}

exports.sendHederaTx = async (req) => {
  const resp = await hedera.sendTransaction(req.signedTx);
  return resp;
}

exports.updateClaimStatus = async (req) => {
  const project = req.project;
  if (project === GRAY_SEMINAR_1) {
    graySeminarMintDB.updateClaimByMintAddress(req.accountId, 1, 1);
  } else if (project === GRAY_SEMINAR_2) {
    graySeminarMintDB.updateClaimByMintAddress(req.accountId, 1, 2);
  } else {
    return false;
  }
}

exports.claim = async (req) => {
  const project = req.project;
  if (project === GRAY_SEMINAR_1) {
    const serials = await graySeminarMintDB.selectHederaGraySeminarMintAddress(req.accountId, 0, 1);
    if (serials.length !== 1) {
      return false;
    }
    const operatorPay = true;
    let tx = await hedera.getTransferTx(operatorPay, GRAY_SEMINAR_1_TOKEN_ID, serials[0].serial, req.accountId, GRAY_SEMINAR_MINT_PRICE);
    return tx.toBytes();
  } else if (project === GRAY_SEMINAR_2) {
    const serials = await graySeminarMintDB.selectHederaGraySeminarMintAddress(req.accountId, 0, 2);
    if (serials.length !== 1) {
      return false;
    }
    const operatorPay = true;
    let tx = await hedera.getTransferTx(operatorPay, GRAY_SEMINAR_2_TOKEN_ID, serials[0].serial, req.accountId, GRAY_SEMINAR_MINT_PRICE);
    return tx.toBytes();
  } 
  return false;
}

exports.checkMintable = async (req) => {
  return await checkMintable(req.project, req.accountId, 0);
}


exports.sendMintTx = async (req) => {
  const mintable = await checkMintable(req.project, req.accountId, 0);
  if (!mintable) {
    return false;
  }
  const serial = await hedera.sendTokenMintTransaction(req.signedTx)
  if (req.project == GRAY_SEMINAR_1) {
    let data = {
      tokenId: GRAY_SEMINAR_2_TOKEN_ID,
      serial: serial[0].toString(),
      mintAddress: req.accountId
    }
    graySeminarMintDB.insertHederaGraySeminarMint(data, 1);
  } else if (req.project == GRAY_SEMINAR_2) {
    let data = {
      tokenId: GRAY_SEMINAR_2_TOKEN_ID,
      serial: serial[0].toString(),
      mintAddress: req.accountId
    }
    graySeminarMintDB.insertHederaGraySeminarMint(data, 2);
  }
  
  return true;
}

checkMintable = async (project, accountId, claim) => {
  let unClaimHistory;
  if (project === GRAY_SEMINAR_1) {
    unClaimHistory = await graySeminarMintDB.selectHederaGraySeminarMintAddress(accountId, claim, 1)
  } else if (project == GRAY_SEMINAR_2) {
    unClaimHistory = await freshManMintDB.selectHederaFreshmManMintAddress(accountId, claim)
  } else if (project == "freshman") {
    unClaimHistory = await graySeminarMintDB.selectHederaGraySeminarMintAddress(accountId, claim, 2)
  }
  
  if (unClaimHistory.length > 0 ) {
    logger.info(`${accountId} is not claim, can not mint`);
    console.log('can not mint');
    return false;
  } else if (unClaimHistory.length > 1) {
    logger.info(`${accountId} claim history over 2, something wrong, can not mint`);
    console.log('claim history over 2, something wrong, can not mint');
    return false;
  }
  return true;
}

selectMetadata = async (project, index) => {
  if (project == GRAY_SEMINAR_2) {
    return await graySeminarMetadataDB.selectHederaGraySeminarMetadata(index);
  } else if (project == "freshman") {
    return await freshManMetadataDB.selectHederaFreshmManMetadata(index);
  }
}

getRandomNumber = (project) => {
  if (project == GRAY_SEMINAR_2) {
    return Math.floor(Math.random() * (GRAY_SEMINAR_2_SUPPLY_MAX - SERIAL_START)) + SERIAL_START;
  } else if (project == "freshman") {
    return Math.floor(Math.random() * (FRESHMAN_MAX - SERIAL_START)) + SERIAL_START;
  }
}

getMintableSerial = async (project, accountId) => {
  // while(true) {
  //   let randomNumber = getRandomNumber(project);
  //   let mintCount = 0;
  //   if (project == GRAY_SEMINAR_1) {
  //     mintCount = await graySeminarMintDB.selectHederaGraySeminarMintAddressBySerial(randomNumber);
  //   }
  //   if (mintCount == 0) {
  //     return randomNumber;
  //   }

  // }
  let mintCount = 0;
  if (project == GRAY_SEMINAR_1) {
    let res = await graySeminarMintDB.selectHederaGraySeminarMintAddress(accountId, null, 1);
    if (res.length > 0) {
      return -1;
    }
    res = await graySeminarMintDB.getMintCount(1);
    mintCount = res[0].count;
  } else if (project == GRAY_SEMINAR_2) {
    let res = await graySeminarMintDB.selectHederaGraySeminarMintAddress(accountId, null, 2);
    if (res.length > 0) {
      return -1;
    }
    res = await graySeminarMintDB.getMintCount(2);
    mintCount = res[0].count;
  }
  console.log(mintCount);
  return mintCount + 1;
}
