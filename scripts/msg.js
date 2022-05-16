const {
  Client,
  PrivateKey,
  TopicCreateTransaction,
} = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {
  //Grab your Hedera testnet account ID and private key
  const myAccountId = process.env.HBAR_OPERATOR_ID;
  const myPrivateKey = process.env.HBAR_OPERATOR_KEY;

  //If we weren't able to grab it, we should throw a new error
  if (myAccountId == null || myPrivateKey == null) {
    throw new Error(
      "Environment variables myAccountId and myPrivateKey must be present"
    );
  }

  //Create our connection to the Hedera network
  //The Hedera JS SDK makes this reallyyy easy!
  const client = Client.forTestnet();
  client.setOperator(myAccountId, myPrivateKey);
  // create topic
  const createResponse = await new TopicCreateTransaction().execute(client);
  const createReceipt = await createResponse.getReceipt(client);

  console.log(`topic id = ${createReceipt.topicId}`);
}

main();
