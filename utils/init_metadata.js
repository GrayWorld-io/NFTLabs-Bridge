var graySeminarMetadataDB = require("../models/hedera/gray/seminar/metadata");
var constants = require("../lib/constants");

const GRAY_SEMINAR_SUPPLY_MAX = constants.GRAY_SEMINAR_SUPPLY_MAX;
const GRAY_SEMINAR_1_GOLD_SUPPLY_MAX = constants.GRAY_SEMINAR_1_GOLD_SUPPLY_MAX;
const GRAY_SEMINAR_1_SILVER_SUPPLY_MAX = constants.GRAY_SEMINAR_1_SILVER_SUPPLY_MAX;
const GRAY_SEMINAR_1_GOLD_METADATA_CID = constants.GRAY_SEMINAR_1_GOLD_METADATA_CID;
const GRAY_SEMINAR_1_SILVER_METADATA_CID = constants.GRAY_SEMINAR_1_SILVER_METADATA_CID;

const GRAY_SEMINAR_2_SUPPLY_MAX = constants.GRAY_SEMINAR_2_SUPPLY_MAX;
const GRAY_SEMINAR_2_GOLD_SUPPLY_MAX = constants.GRAY_SEMINAR_2_GOLD_SUPPLY_MAX;
const GRAY_SEMINAR_2_SILVER_SUPPLY_MAX = constants.GRAY_SEMINAR_2_SILVER_SUPPLY_MAX;
const GRAY_SEMINAR_2_GOLD_METADATA_CID = constants.GRAY_SEMINAR_2_GOLD_METADATA_CID;
const GRAY_SEMINAR_2_SILVER_METADATA_CID = constants.GRAY_SEMINAR_2_SILVER_METADATA_CID;

const GRAY_SEMINAR_METADATA_PROTOCOL = constants.GRAY_SEMINAR_METADATA_PROTOCOL;
shuffle = (array) => { array.sort(() => Math.random() - 0.5); }

insertGraySeminar1Metadata = () => {
    let list = [];
    for (var i = 0; i < GRAY_SEMINAR_1_GOLD_SUPPLY_MAX; i++) {
        list.push(GRAY_SEMINAR_1_GOLD_METADATA_CID);
    }
    for (var i = 0; i < GRAY_SEMINAR_1_SILVER_SUPPLY_MAX; i++) {
        list.push(GRAY_SEMINAR_1_SILVER_METADATA_CID);
    }

    shuffle(list);
    for (var i = 0; i < GRAY_SEMINAR_SUPPLY_MAX; i++) {
        graySeminarMetadataDB.insertCid(GRAY_SEMINAR_METADATA_PROTOCOL, list[i]);
    }
    
}

insertGraySeminar2Metadata = () => {
    let list = [];
    for (var i = 0; i < GRAY_SEMINAR_2_GOLD_SUPPLY_MAX; i++) {
        list.push(GRAY_SEMINAR_2_GOLD_METADATA_CID);
    }
    for (var i = 0; i < GRAY_SEMINAR_2_SILVER_SUPPLY_MAX; i++) {
        list.push(GRAY_SEMINAR_2_SILVER_METADATA_CID);
    }

    shuffle(list);
    for (var i = 0; i < GRAY_SEMINAR_2_SUPPLY_MAX; i++) {
        graySeminarMetadataDB.insertCid(GRAY_SEMINAR_METADATA_PROTOCOL, list[i]);
    }
    
}
// insertGraySeminar1Metadata();
insertGraySeminar2Metadata();