require("dotenv").config();

const {
    Client,
    AccountId,
    PrivateKey,
    TokenId,
    TopicCreateTransaction
} = require("@hashgraph/sdk");

const constants = require("../lib/constants/constants_token_info");

const GRAY_SEMINAR_SUPPLY_MAX = constants.GRAY_SEMINAR_2_SUPPLY_MAX;

async function main() {

    let client;

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
    let resp = '';
    resp = await new TopicCreateTransaction()
    .setTopicMemo("create gray hedera lock topic")
    .execute(client);
    const receipt = await resp.getReceipt(client);
    const topicId = receipt.topicId;

    console.log(`topicId = ${topicId.toString()}`);

}

main();