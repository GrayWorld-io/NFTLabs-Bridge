const {
    Client,
    TransactionId,
    ContractCreateTransaction,
    ContractExecuteTransaction,
    Transaction,
    FileCreateTransaction,
    AccountId,
    Hbar,
    PrivateKey, ContractCallQuery,
    TokenInfoQuery,
    TransactionRecordQuery,
    ContractFunctionParameters,
    TokenCreateTransaction,
    TokenAssociateTransaction,
    TokenUpdateTransaction,
    TokenMintTransaction
} = require("@hashgraph/sdk");

const defaultGas = 1000000;
const hederaBridgeContract = require('../bin/contracts/HederaBridgeService.json');

const Web3 = require("web3");
const { param } = require("../routes");
const web3 = new Web3;

exports.call = async function (client, contractId, functionName, parameters) {
    console.log(`calling ${functionName} with [${parameters}]`);

    // generate function call with function name and parameters
    const functionCallAsUint8Array = encodeFunctionCall(hederaBridgeContract.abi, functionName, parameters);

    // execute the transaction
    const transaction = await new ContractExecuteTransaction()
        .setContractId(contractId)
        .setFunctionParameters(functionCallAsUint8Array)
        .setGas(defaultGas)
        .execute(client);

    // a record contains the output of the function
    const record = await transaction.getRecord(client);
    // the result of the function call is in record.contractFunctionResult.bytes
    // let`s parse it using ethers.js
    const results = decodeFunctionResult(hederaBridgeContract.abi, functionName, record.contractFunctionResult.bytes);
    return results;

}

exports.getContractCallTx = async function (client, operatorPay, accountId, contractId, functionName, parameters, gas) {
    console.log(`calling ${functionName} with [${parameters}]`);

    // generate function call with function name and parameters
    const functionCallAsUint8Array = encodeFunctionCall(hederaBridgeContract.abi, functionName, parameters);

    if (operatorPay) {
        txId = TransactionId.generate(client.operatorAccountId);
      } else {
        txId = TransactionId.generate(accountId);
      }
    // execute the transaction
    const transaction = await new ContractExecuteTransaction()
        .setContractId(contractId)
        .setFunctionParameters(functionCallAsUint8Array)
        .setGas(defaultGas)
        .setTransactionId(txId)
        .freezeWith(client)
    return transaction;
}

/**
 * Encodes a function call so that the contract's function can be executed or called
 * @param functionName the name of the function to call
 * @param parameters the array of parameters to pass to the function
 */
 function encodeFunctionCall(abi, functionName, parameters) {
    const functionAbi = abi.find(func => (func.name === functionName && func.type === "function"));
    const encodedParametersHex = web3.eth.abi.encodeFunctionCall(functionAbi, parameters).slice(2);
    return Buffer.from(encodedParametersHex, 'hex');
}

/**
 * Decodes the result of a contract's function execution
 * @param functionName the name of the function within the ABI
 * @param resultAsBytes a byte array containing the execution result
 */
function decodeFunctionResult(abi, functionName, resultAsBytes) {
    const functionAbi = abi.find(func => func.name === functionName);
    const functionParameters = functionAbi.outputs;
    const resultHex = '0x'.concat(Buffer.from(resultAsBytes).toString('hex'));
    const result = web3.eth.abi.decodeParameters(functionParameters, resultHex);
    return result;
}