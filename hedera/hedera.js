const {
  Client,
  Transaction,
  PrivateKey,
  AccountId,
  TokenId,
  ContractId,
  TokenAssociateTransaction,
  TokenMintTransaction,
  TransferTransaction,
  TopicMessageSubmitTransaction,
  Hbar,
  TransactionId,
} = require("@hashgraph/sdk");

const constants = require("../tests/test_constant");
const logger = require("../utils/logger");

require("dotenv").config();

let client = '';
const operatorPrivateKey = process.env.HBAR_OPERATOR_KEY;
const operatorAccount = process.env.HBAR_OPERATOR_ID;
const grayworldAccount = process.env.GRAYWORLD_HEDERA_ACCOUNT_ID;

if (process.env.HEDERA_NETWORK != null) {
  switch (process.env.HEDERA_NETWORK) {
    case "previewnet":
      client = Client.forPreviewnet();
      break;
    case "mainnet":
      client = Client.forMainnet();
      break;
    default:
      client = Client.forTestnet();
      client.setOperator(operatorAccount, operatorPrivateKey);
  }
}

exports.getClient = () => {
  return client;
}

exports.toSolidityAddress = (tokenId) => {
  return '0x' + TokenId.fromString(tokenId).toSolidityAddress();
}
exports.fromSolidityAddress = (tokenId) => {
  return TokenId.fromSolidityAddress(tokenId).toString();
}

exports.toAccountSolidityAddress = (tokenId) => {
  return '0x' + AccountId.fromString(tokenId).toSolidityAddress();
}

exports.fromAccountSolidityAddress = (accountId) => {
  return AccountId.fromSolidityAddress(accountId).toString();
}

exports.toContractSolidityAddress = (contractId) => {
  return '0x' + ContractId.fromString(contractId).toSolidityAddress();
}

exports.sendHCSMessage = async (topicId, message) => {
  console.log(topicId);
  await (
    await new TopicMessageSubmitTransaction()
      .setNodeAccountIds([new AccountId(3)])
      .setTopicId(topicId)
      .setMessage(message)
      .execute(client)
  ).getReceipt(client);
    return true;
}

exports.getTokenMintTransaction = async (operatorPay, accountId, tokenId, storage, cid) => {
  let txId;
  if (operatorPay) {
    txId = TransactionId.generate(operatorAccount);
  } else {
    txId = TransactionId.generate(accountId);
  }

  const metadataUrl = `${storage}://${cid}`
  console.log(metadataUrl);
  const tx = await new TokenMintTransaction()
    .setNodeAccountIds([new AccountId(3)])
    .setTokenId(tokenId)
    .setMetadata([Buffer.from(metadataUrl)])
    .setTransactionId(txId)
    .setTransactionMemo("[GW]Token Mint")
    .freezeWith(client)
    .sign(PrivateKey.fromString(operatorPrivateKey));
  return tx;
}

exports.sendTokenMintTransaction = async (signedTx) => {
  const txBytes = new Uint8Array(Object.values(signedTx.signedTransaction));
  const resp = await Transaction.fromBytes(txBytes).execute(client);
  const serials = (await resp.getReceipt(client)).serials;
  return serials;
}

exports.mintNFT = async (tokenId, storage, cid) => {
  const metadataUrl = `${storage}"://${cid}`
  const tx = await new TokenMintTransaction()
    .setTokenId(tokenId)
    .addMetadata(Buffer.from(metadataUrl))
    .freezeWith(client);
  let resp = await tx.execute(client);
  const serials = (await resp.getReceipt(client)).serials;
  return serials;
}

exports.getTransferTx = async (operatorPay, tokenId, serial, nftMintingAccountId, price) => {
  let txId;
  if (operatorPay) {
    txId = TransactionId.generate(operatorAccount);
  } else {
    txId = TransactionId.generate(nftMintingAccountId);
  }

  const tx = await new TransferTransaction()
    .setNodeAccountIds([new AccountId(3)])
    .addNftTransfer(tokenId, serial, operatorAccount, nftMintingAccountId)
    .addHbarTransfer(nftMintingAccountId, -price)
    .addHbarTransfer(operatorAccount, price)
    .setTransactionId(txId)
    .setTransactionMemo("[GW]Token Transfer")
    .freezeWith(client)
    .sign(PrivateKey.fromString(operatorPrivateKey))
  return tx;
}

exports.getTokenAssociateTx = async (operatorPay, accountId, tokenId) => {
  let txId;
  if (operatorPay) {
    txId = TransactionId.generate(operatorAccount);
  } else {
    txId = TransactionId.generate(accountId);
  }

  const tx = await new TokenAssociateTransaction()
    .setNodeAccountIds([new AccountId(3)])
    .setAccountId(accountId)
    .setTokenIds([tokenId])
    .setTransactionId(txId)
    .setTransactionMemo("[GW]Token Associate")
    .freezeWith(client)
    .sign(PrivateKey.fromString(operatorPrivateKey))
  return tx;
}

// const createAccountIniㄹㄷtialBalance = 100;
// const createAccount = async function (callback) {
//   var key = await PrivateKey.generate();
//   var createAccountTransacㄱㄹf///tion = await new AccountCreateTransaction()
//     .setInitialBalance(new Hbar(createAccountInitialBalance))
//     .setKey(key.publicKey);

//   var response = await createAccountTransaction.execute(client);
//   let receipt = await response.getReceipt(client);
//   var account = {
//     privateKey: key + "",
//     publicKey: key.publicKey + "",
//     // hederaAccount: receipt.accoun ㅊ ㅡㅏㅏㅐ,ㅔ;.tId + "",
//   };
//   return callback(null, account);
// };

function getNewArrayBuffer(buf) {
  let newArray = new Uint8Array(buf.length);
  for (var i = 0; i < buf.length; i++) {
    newArray[i] = buf[i];
  }
  return newArray;
}

const getBalance = async function (accountId, callback) {
  const balances = await new AccountBalanceQuery()
    .setAccountId(accountId)
    .execute(client);

  let balance = {
    tokens: JSON.parse(balances.tokens.toString()),
    hbar: balances.hbars.toString(),
  };
  return callback(null, balance);
};

const createFile = async function (metadata, callback) {
  const fileCreateTransaction = new FileCreateTransaction();
  fileCreateTransaction.setContents(JSON.stringify(metadata));
  let transactionReceipt;
  try {
    let sendTx = await fileCreateTransaction.execute(client);
    transactionReceipt = await sendTx.getReceipt(client);
  } catch (e) {
    console.log(e);
    return callback(new Error("file create error"));
  }
  return callback(null, transactionReceipt);
};

const getFile = async function (fileId, callback) {
  let info = {};
  try {
    console.log(fileId);
    info = await new FileContentsQuery()
      .setFileId(FileId.fromString(fileId))
      .execute(client);
  } catch (err) {
    return callback(err);
  }
  return callback(null, info);
};

const associateToken = async function (
  accountId,
  accountKey,
  tokenId,
  callback
) {
  let transactionReceipt = {};
  try {
    transactionReceipt = await (
      await (
        await new TokenAssociateTransaction()
          .setNodeAccountIds([new AccountId(3)])
          .setAccountId(accountId)
          .setTokenIds([tokenId])
          .freezeWith(client)
          .sign(PrivateKey.fromString(accountKey))
      ).execute(client)
    ).getReceipt(client);
  } catch (e) {
    console.log(e);
    // return callback(null);
  }
  return callback(null, transactionReceipt);
};

const transferToken = async function (
  from,
  to,
  tokenId,
  fromAccountKey,
  callback
) {
  let transactionReceipt = {};
  try {
    transactionReceipt = await (
      await (
        await new TransferTransaction()
          .setNodeAccountIds([new AccountId(3)])
          .addTokenTransfer(tokenId, from, -1)
          .addTokenTransfer(tokenId, to, 1)
          .freezeWith(client)
          .sign(PrivateKey.fromString(fromAccountKey))
      ).execute(client)
    ).getReceipt(client);
  } catch (e) {
    console.log(e);
    logger.error(e);
    return callback(new Error("transfer token error"));
  }
  return callback(null, transactionReceipt);
};

const transferHbar = async function (
  from,
  to,
  amount,
  fromAccountKey,
  callback
) {
  let transactionReceipt = {};
  try {
    transactionReceipt = await (
      await (
        await new TransferTransaction()
          .setNodeAccountIds([new AccountId(3)])
          .addHbarTransfer(from, -amount)
          .addHbarTransfer(to, amount)
          .freezeWith(client)
          .sign(PrivateKey.fromString(fromAccountKey))
      ).execute(client)
    ).getReceipt(client);
  } catch (e) {
    console.log(e);
    logger.error(e);
    return callback(new Error("transfer token error"));
  }
  return callback(null, transactionReceipt);
};

// const sendTransaction = async function (tx, callback) {
//   let transactionReceipt = {};
//   try {
//     // console.log(getNewArrayBuffer(tx));
//     // console.log(Transaction.fromBytes(tx));
//     let txx = Transaction.fromBytes(getNewArrayBuffer(tx));
//     txx.sign(PrivateKey.fromString(operatorPrivateKey));
//     console.log(txx);
//     const createTx = await txx.execute(client);
//     transactionReceipt = await createTx.getReceipt(client);
//   } catch (e) {
//     console.log(e);
//     return callback(new Error("send transaction error"));
//   }
//   return callback(null, transactionReceipt);
// };

exports.sendTransaction = async (signedTx) => {
  // console.log(signedTx)
  // let resp;
  // if (typeof signedTx == Transaction) {
  //   resp = await signedTx.execute(client);
  // } else {
  //   resp = await Transaction.fromBytes(signedTx);
  // }
  // return await resp.getReceipt(client);
  const txBytes = new Uint8Array(Object.values(signedTx.signedTransaction));
  const resp = await Transaction.fromBytes(txBytes).execute(client);
  return await resp.getRecord(client);
}
// module.exports = {
//   sendTransaction,
//   getBalance,
//   associateToken,
//   transferToken,
//   transferHbar,
//   createAccount,
//   createFile,
//   getFile,
// };
