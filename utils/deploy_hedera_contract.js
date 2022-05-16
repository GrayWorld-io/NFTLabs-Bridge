require("dotenv").config();

const {
    Client,
    AccountId,
    PrivateKey,
    TokenType,
    TokenSupplyType,
    TokenCreateTransaction,
    TokenAssociateTransaction,
    ContractCreateTransaction,
    ContractExecuteTransaction,
    FileCreateTransaction,
    Hbar,
    ContractCallQuery,
    TokenInfoQuery,
    TransactionRecordQuery,
    ContractFunctionParameters,

} = require("@hashgraph/sdk");

const constants = require("../lib/constants/constants_token_info");
const contractConstants = require("../lib/constants/constants_contract_info");
const hederaBridgeContract = require('../bin/contracts/HederaBridgeService.json');
const defaultGas = 300000;

const GRAY_SEMINAR_SUPPLY_MAX = constants.GRAY_SEMINAR_2_SUPPLY_MAX;
const GRAY_FRESHMAN_TOKEN_ID = constants.GRAY_FRESHMAN_TOKEN_ID;
const GRAY_HEDERA_BRIDGE_CONTRACT_ID = contractConstants.HEDERA_CONTRACT_ID;

let client;

async function main() {

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
        }
    }
    if (process.env.HBAR_OPERATOR_KEY != null && process.env.HBAR_OPERATOR_ID != null) {
        const operatorKey = PrivateKey.fromString(process.env.HBAR_OPERATOR_KEY);
        const operatorId = AccountId.fromString(process.env.HBAR_OPERATOR_ID);
        client.setOperator(operatorId, operatorKey);
    }
    let contractId = await deploy(client, hederaBridgeContract, [], defaultGas)
    // let contractId = GRAY_HEDERA_BRIDGE_CONTRACT_ID
    let tokenId = GRAY_FRESHMAN_TOKEN_ID;
    tokenAssociate(contractId, tokenId);
}

main();

async function tokenAssociate(contractId, tokenId) {

    const tx = await new TokenAssociateTransaction()
    .setNodeAccountIds([new AccountId(3)])
    .setAccountId(AccountId.fromString(contractId))
    .setTokenIds([tokenId])
    .freezeWith(client)
    .execute(client);
}

async function deploy(client, contractJson, parameters, gas) {

    if (typeof (parameters) === 'undefined') {
        parameters = [];
    }
    console.log(contractJson)
    console.log(`\nDeploying the contract`);

    const fileTransactionResponse = await new FileCreateTransaction()
        .setKeys([client.operatorPublicKey])
        .setContents(contractJson.bytecode)
        .execute(client);


    // Fetch the receipt for transaction that created the file
    const fileReceipt = await fileTransactionResponse.getReceipt(client);

    // The file ID is located on the transaction receipt
    const fileId = fileReceipt.fileId;

    const maxGas = gas;

    const contractTransaction = await new ContractCreateTransaction()
        // Set gas to create the contract
        .setGas(maxGas)
        .setAdminKey(client.operatorPublicKey)
        // The contract bytecode must be set to the file ID containing the contract bytecode
        .setBytecodeFileId(fileId);

    // add constructor parameters if necessary
    // if (parameters.length > 0) {
    //     const functionAbi = missionContract.abi.find(func => (func.type === "constructor"));
    //     const encodedParametersHex = web3.eth.abi.encodeFunctionCall(functionAbi, parameters).slice(2);
    //     const constructorParametersAsUint8Array = Buffer.from(encodedParametersHex, 'hex');

    //     contractTransaction.setConstructorParameters(constructorParametersAsUint8Array)
    // }

    // Create the contract
    const contractTransactionResponse = await contractTransaction.execute(client);

    // Fetch the receipt for the transaction that created the contract
    const contractReceipt = await contractTransactionResponse.getReceipt(client);

    // The contract ID is located on the transaction receipt
    contractId = contractReceipt.contractId;
    console.log(`new contract ID: ${contractId.toString()}`);

    return contractId;
}