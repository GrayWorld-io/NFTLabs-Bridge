const hederaBridgeController = require('./hedera/bridge');
const ethBridgeController = require('./eth/bridge');

exports.getLockAssets = (req) => {
    const network = req.network;
    if (network == 'hedera') {
        return hederaBridgeController.getHederaLockAssets(req);
    } else if (network == 'klaytn') {

    }
}

exports.getMintTx = (req) => {
    const network = req.network;
    if (network == 'eth') {
        return ethBridgeController.getEthMintTx(req);
    } else if (network == 'klaytn') {

    }
}

exports.getMessage = (req) => {
    const network = req.network;
    if (network == 'eth') {
        return ethBridgeController.getEthMintMessage(req);
    } else if (network == 'klaytn') {

    }
}

exports.getLockTx = (req) => {
    const network = req.network;
    if (network == 'hedera') {
        return hederaBridgeController.getHederaLockTx(req);
    } else if (network == 'klaytn') {

    }
}

exports.sendWithdrawTx = async (req) => {
    const network = req.network;
    if (network == 'hedera') {
        const result = await hederaBridgeController.sendHederaTx(req);
        console.log(result.transactionId.toString());
        const data = {
            txId: result.transactionId.toString(),
            owner: req.accountId,
            tokenId: req.tokenId,
            serial: req.serial,
        }
        console.log(data);
        hederaBridgeController.sendHCSMessage(req);
    } else if (network == 'klaytn') {

    }
}

exports.sendLockTx = async (req) => {
    const network = req.network;
    if (network == 'hedera') {
        const result = await hederaBridgeController.sendHederaTx(req);
        console.log(result.transactionId.toString());
        const data = {
            txId: result.transactionId.toString(),
            owner: req.accountId,
            tokenId: req.tokenId,
            serial: req.serial,
        }
        console.log(data);
        hederaBridgeController.sendHCSMessage(req);
    } else if (network == 'klaytn') {

    }
}

exports.getWithdrawTx = (req) => {
    const network = req.network;
    if (network == 'hedera') {
        return hederaBridgeController.getHederaWithdrawTx(req);
    } else if (network == 'klaytn') {

    }
}

exports.sendMintTx = (req) => {
    const network = req.network;
    if (network == 'hedera') {
        return hederaMint.sendMintTx(req);
    } else if (network == 'klaytn') {

    }
}

exports.checkMintable = (req) => {
    const network = req.network;
    if (network == 'hedera') {
        return hederaMint.checkMintable(req);
    } else if (network == 'klaytn') {

    }
}

exports.claimNFT = (req) => {
    const network = req.network;
    if (network == 'hedera') {
        return hederaMint.claim(req);
    } else if (network == 'klaytn') {

    }
}

exports.updateClaimNFTStatus = (req) => {
    const network = req.network;
    if (network == 'hedera') {
        return hederaMint.updateClaimStatus(req);
    } else if (network == 'klaytn') {

    }
}