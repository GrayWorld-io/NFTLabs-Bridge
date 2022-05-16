const fs = require('fs');

const constants = require('../lib/constants/constants_token_info');
const resCode = require('../lib/constants/constants_res_code');
const logger = require('../utils/logger');
const GRAY_SEMINAR_1 = constants.GRAY_SEMINAR_1;
const GRAY_SEMINAR_2 = constants.GRAY_SEMINAR_2;

exports.checkWhiteList = (req, res, next) => {
    console.log('whitelisting');
    console.log(req.body.project);
    const project = req.body.project;
    const accountId = req.body.accountId;
    let whiteListing = false;
    try {
        if (project == GRAY_SEMINAR_1) {
            let whiteListFile = fs.readFileSync('../whitelist/gray_seminar_1.json', 'utf8');
            whiteListing = isWhiteListing(whiteListFile, accountId);
        } else if (project == GRAY_SEMINAR_2) {
            whiteListFile = fs.readFileSync('./whitelist/gray_seminar_2.json', 'utf8');
            whiteListing = isWhiteListing(whiteListFile, accountId);
        }
        if (!whiteListing) {
            console.log(`${project}: ${accountId} is not whitelisting!`)
            logger.info(`${project}: ${accountId} is not whitelisting!`)
            res.json({
                result: resCode.NOT_WHITELISTING
            });
        } else {
            next()
        }
        
        
    } catch (e) {
        console.log (e);
    }
    
}

isWhiteListing = (list, accountId) => {
    console.log(list)
    const whiteList = JSON.parse(list);
    for (whiteListAccount of whiteList) {
        if (whiteListAccount == accountId) {
            return true;
        }
    }
    return false;
}