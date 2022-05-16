const axios = require('axios');

var graySeminarMintDB = require("../models/hedera/gray/seminar/mint");
var constants = require("../lib/constants/constants_token_info");
const logger = require("./logger");

const GRAY_SEMINAR_1_TOKEN_ID = constants.GRAY_SEMINAR_1_TOKEN_ID;
const GRAY_SEMINAR_2_TOKEN_ID = constants.GRAY_SEMINAR_2_TOKEN_ID;

const syncGraySeminar1 = async () => {
    const res = await graySeminarMintDB.selectMintHistoryByClaim(GRAY_SEMINAR_1_TOKEN_ID, 0, 1);
    if (res.length == 0) {
        logger.info('All GRAY_SEMINAR_1_TOKEN_ID tokens are claimed');
    } else {
        console.log(res)
        for (var info of res) {
            const result = await axios.get(
                `https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/${GRAY_SEMINAR_1_TOKEN_ID}/nfts?account.id=${info.mintAddress}&serialNumber=${info.serial}`
            );
            const nftList = result.data.nfts;
            if (nftList.length > 0) {
                graySeminarMintDB.updateClaimByMintAddress(info.mintAddress, 1, 1);
            }
        }
    }
}

const syncGraySeminar2 = async () => {
    const res = await graySeminarMintDB.selectMintHistoryByClaim(GRAY_SEMINAR_2_TOKEN_ID, 0, 2);
    if (res.length == 0) {
        logger.info('All GRAY_SEMINAR_1_TOKEN_ID tokens are claimed');
    } else {
        for (var info of res) {
            const result = await axios.get(
                `https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/${GRAY_SEMINAR_2_TOKEN_ID}/nfts?account.id=${info.mintAddress}&serialNumber=${info.serial}`
            );
            const nftList = result.data.nfts;
            if (nftList.length > 0) {
                graySeminarMintDB.updateClaimByMintAddress(info.mintAddress, 1, 2);
            }
        }
    }
}



syncGraySeminar1();
syncGraySeminar2();
