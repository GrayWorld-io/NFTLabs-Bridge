require("dotenv").config()

const fs = require('fs');
const {ethers} = require('ethers');
const Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY_RINKEBY;

var provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`, 4);  //4 rinkeby
const web3 = new Web3(`https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`);

var ContractAddressConstants = require("../../lib/constants/constants_contract_info");
var resCode = require("../../lib/constants/constants_res_code");
const GrayBridgeContractJson = require('../../bin/contracts/EthBridgeService.json');   

const GRAY_FRESHMAN = ContractAddressConstants.GRAY_FRESHMAN;
const ETH_GRAY_FRESHMAN_COLLECTION_ID = ContractAddressConstants.ETH_GRAY_FRESHMAN_COLLECTION_ID
const GRAY_ETH_BRIDGE_CONTRACT_ID = ContractAddressConstants.GRAY_ETH_BRIDGE_CONTRACT_ID;

exports.getEthMintMessage = async (req) => {
  const nonce = await web3.eth.getTransactionCount(req.account);
  console.log('nonce: ' + nonce);
  const metadata = req.metadata;
  const message = web3.utils.soliditySha3(
    {t: 'address', v: req.account},
    {t: 'address', v: ETH_GRAY_FRESHMAN_COLLECTION_ID},
    {t: 'string', v: metadata},
    {t: 'uint256', v: nonce},
    ).toString('hex');
    console.log('message: '+ message)
    return {
      code: resCode.SUCCESS,
      message: message
    }
}

exports.getEthMintTx = async (req) => {
  const toAccount = req.account;
  const metadata = req.metadata;
  const nonce = await provider.getTransactionCount(toAccount);

  if (req.project == GRAY_FRESHMAN) {
    var contract = new ethers.Contract(GRAY_ETH_BRIDGE_CONTRACT_ID, GrayBridgeContractJson.abi, provider);
    const signature = req.signature;
    var result = await contract.populateTransaction.mint(nonce, ETH_GRAY_FRESHMAN_COLLECTION_ID, toAccount, metadata, signature);
    result.from = toAccount;
    console.log(result);
    return {
      code: resCode.SUCCESS,
      tx: result
    }
  }
  
}

exports.sendTx = async (req)  => {
  const result = await provider.sendTransaction(req.tx);
  console.log(result.hash);
  return result.hash;
}
