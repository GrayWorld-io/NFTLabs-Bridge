var freshManMintDB = require("../../models/hedera/freshman/mint");
var freshManMetadataDB = require("../../models/hedera/freshman/metadata");
var graySeminarMintDB = require("../../models/hedera/gray/seminar/mint");
var graySeminarMetadataDB = require("../../models/hedera/gray/seminar/metadata");
var hedera = require("../../hedera/hedera");
var logger = require("../../utils/logger");

var constants = require("../../lib/constants/constants_token_info");
var resCode = require("../../lib/constants/constants_res_code");

// const FRESHMAN_MAX = 5;
// const SERIAL_START = 1;
// const FRESHMAN_TOKEN_ID = "0.0.34204880"
// const FRESHMAN_STORAGE = "ipfs"
// const FRESHMAN_MINT_PRICE = 2;

const SERIAL_START = constants.SERIAL_START;

const FRESHMAN = constants.

const GRAY_SEMINAR_1 = constants.GRAY_SEMINAR_1;
const GRAY_SEMINAR_SUPPLY_MAX = constants.GRAY_SEMINAR_SUPPLY_MAX;
const GRAY_SEMINAR_1_TOKEN_ID = constants.GRAY_SEMINAR_1_TOKEN_ID;

const GRAY_SEMINAR_2 = constants.GRAY_SEMINAR_2;
const GRAY_SEMINAR_2_SUPPLY_MAX = constants.GRAY_SEMINAR_2_SUPPLY_MAX;
const GRAY_SEMINAR_2_TOKEN_ID = constants.GRAY_SEMINAR_2_TOKEN_ID;

const GRAY_SEMINAR_METADATA_PROTOCOL = constants.GRAY_SEMINAR_METADATA_PROTOCOL;
const GRAY_SEMINAR_MINT_PRICE = constants.GRAY_SEMINAR_MINT_PRICE;

// exports.mintWithTransferTx = async (req) => {
//   const nftMintingAccountId = req.accountId;
//   const randImgIndex = await getMintableSerial(req.project)
//   console.log(randImgIndex)
//   console.log(nftMintingAccountId)
//   //todo set index
//   const cid = await selectMetadata(1);
//   const serial = await hedera.mintNFT(FRESHMAN_TOKEN_ID, FRESHMAN_STORAGE, cid)
//   console.log(serial[0].toString());
//   return await hedera.getTransferTx(FRESHMAN_TOKEN_ID, serial[0].toString(), nftMintingAccountId, FRESHMAN_MINT_PRICE);
// }

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

exports.getMintTx = async (req) => {
  const project = req.project;
  const randImgIndex = await getMintableSerial(req.project, req.accountId)
  if (randImgIndex === -1 ) {
    return {
      result: resCode.MINT_AMOUNT_EXCEED
    }
  }
  const cid = await selectMetadata(req.project, randImgIndex);
  let tx;
  if (project == GRAY_SEMINAR_2) {
    const operatorPay = true;
    tx = await hedera.getTokenMintTransaction(operatorPay, req.accountId, GRAY_SEMINAR_2_TOKEN_ID, GRAY_SEMINAR_METADATA_PROTOCOL, cid[0].cid)
  }
  
  return {
    code: resCode.MINT_SUCCESS,
    tx: tx.toBytes()
  } 
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
  } else if (req.project == FRES)
  
  return true;
}

checkMintable = async (project, accountId, claim) => {
  let unClaimHistory;
  if (project === GRAY_SEMINAR_1) {
    unClaimHistory = await graySeminarMintDB.selectHederaGraySeminarMintAddress(accountId, claim, 1)
  } else if (project == GRAY_SEMINAR_2) {
    unClaimHistory = await graySeminarMintDB.selectHederaGraySeminarMintAddress(accountId, claim, 2)
  } else if (project == "freshman") {
    unClaimHistory = await freshManMintDB.selectHederaFreshmManMintAddress(accountId, claim)
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
