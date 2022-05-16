const axios = require('axios');

var hedera = require("../../hedera/hedera");
var logger = require("../../utils/logger");
var constants = require("../../lib/constants/constants_token_info");

exports.tokenAssociate = async (req) => {
  let tokenId;
  let operatorPay;
  if (req.project == 'gray_seminar_1') {
    tokenId = constants.GRAY_SEMINAR_1_TOKEN_ID;
    operatorPay = true;
  } else if (req.project == 'gray_seminar_2') {
    tokenId = constants.GRAY_SEMINAR_2_TOKEN_ID;
    operatorPay = true;
  }
  const tx = await hedera.getTokenAssociateTx(operatorPay, req.accountId, tokenId);
  return tx.toBytes();
}

exports.getNFTList = async (req) => {
  let nfts = [];
  const tokenId = req.tokenId;
  const accountId = req.accountId;
  const result = await axios.get(
    `https://testnet.mirrornode.hedera.com/api/v1/tokens/${tokenId}/nfts?account.id=${accountId}`
  );
  const nftList = result.data.nfts;
  console.log(nftList);
  for (var nft of nftList) {
    var item = {
      metadata: atob(nft.metadata).substring(7),
      imageUrl: "",
      description: "",
      name: "",
      tokenId: "",
      serial: "",
    };
    const metadata = (
      await axios.get(`https://cloudflare-ipfs.com/ipfs/${item.metadata}`)
    ).data;
    item.description = metadata.description;
    item.tokenId = nft.token_id;
    item.serial = nft.serial_number;
    const imageHash = metadata.image.substring(7);
    item.imageUrl = `https://cloudflare-ipfs.com/ipfs/${imageHash}`;
    console.log(item);
    nfts.push(item);
  }
  return nfts;
}

exports.getNFTInfo = async (req) => {
  const tokenId = req.tokenId;
  const serial = req.serial;
  const result = await axios.get(
    `https://testnet.mirrornode.hedera.com/api/v1/tokens/${tokenId}/nfts/${serial}`
  );
  let info = {
    metadata: '',
    imageUrl: ''
  }
  const nftInfo = result.data;
  info.metadata = atob(nftInfo.metadata).substring(7);
  const metadata = (
    await axios.get(`https://cloudflare-ipfs.com/ipfs/${atob(nftInfo.metadata).substring(7)}`)
  ).data;
  const imageHash = metadata.image.substring(7);
  info.imageUrl = `https://cloudflare-ipfs.com/ipfs/${imageHash}`;
  return info;
}

