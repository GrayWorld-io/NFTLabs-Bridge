require("dotenv").config();

const {
    Client,
    AccountId,
    PrivateKey,
    TokenId,
    TokenType,
    TokenSupplyType,
    TokenCreateTransaction,
    TokenMintTransaction,
    TransferTransaction,
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
    const TOKEN_MAX_SUPPLY = GRAY_SEMINAR_SUPPLY_MAX;
    // let resp = await new TokenCreateTransaction()
    //     .setTokenType(TokenType.NonFungibleUnique)
    //     .setInitialSupply(0)
    //     .setSupplyType(TokenSupplyType.Finite)
    //     .setMaxSupply(TOKEN_MAX_SUPPLY)
    //     .setTokenName("GRAYBRIDGETEST")
    //     .setTokenSymbol("GBGT")
    //     .setTreasuryAccountId(client.operatorAccountId)
    //     .setAdminKey(client.operatorPublicKey)
    //     .setFreezeKey(client.operatorPublicKey)
    //     .setWipeKey(client.operatorPublicKey)
    //     .setSupplyKey(client.operatorPublicKey)
    //     .setFreezeDefault(false)
    //     .execute(client);

    // const tokenId = (await resp.getReceipt(client)).tokenId;
    // console.log(`token id = ${tokenId}`);

    // resp = await new TokenMintTransaction()
    //     .setTokenId(tokenId)
    //     .addMetadata(Buffer.from('IPFS://bafkreiahiqbfa62ah5byjgb4vsacwk7xkjywmljlym3exgd5yborw3zad4'))
    //     .execute(client)
    // const serials = (await resp.getReceipt(client)).serials;
    // console.log(`serials = ${serials}`);

    let tokenId = TokenId.fromString('0.0.34745959')
    let serial = 1;
    resp = await (await new TransferTransaction()
        .addNftTransfer(tokenId, serial, client.operatorAccountId, process.env.HBAR_USER_ID )
        .execute(client))
        .getReceipt(client);
    console.log(await resp.getReceipt(client))
}

main();