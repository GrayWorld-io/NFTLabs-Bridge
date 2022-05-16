const {
    Client,
    TopicMessageQuery
} = require("@hashgraph/sdk");

// const ethController = 

const constants = require("../lib/constants/constants_topic_info");
const logger = require("../utils/logger");

require("dotenv").config();

let client = '';
const operatorPrivateKey = process.env.HBAR_OPERATOR_KEY;
const operatorAccount = process.env.HBAR_OPERATOR_ID;

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

new TopicMessageQuery()
    .setTopicId(constants.HEDERA_SWAP_TOPIC_ID)
    .setStartTime(0)
    .subscribe(client, null, (message) =>
        console.log(Buffer.from(message.contents).toString("utf8"))

    );
