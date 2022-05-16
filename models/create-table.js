const logger = require("../utils/logger");
const dbConnect = require("../db/mysql-connector");

exports.init = async () => {
    createTable('hedera_freshman_metadata', 'hedera_freshman_mint');
    createTable('hedera_seminar_1_metadata', 'hedera_seminar_1_mint');
    createTable('hedera_seminar_2_metadata', 'hedera_seminar_2_mint');
}

createTable = async (metadataTableName, mintTableName) => {
    let connection = await dbConnect.getDBCon();
    connection.query(
        `CREATE TABLE IF NOT EXISTS ${metadataTableName} ( ` +
        `idx int NOT NULL AUTO_INCREMENT, ` +
        `storage varchar(20), `+
        `cid varchar(100), `+
        `PRIMARY KEY (idx) )` 
    );
    connection.query(
        `CREATE TABLE IF NOT EXISTS ${mintTableName} ( ` +
        `idx int NOT NULL AUTO_INCREMENT, ` +
        `tokenId varchar(20), ` +
        `serial int, `+
        `mintAddress varchar(20), ` +
        `claim tinyint(1) default 0, ` +
        `mintDate TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP, ` +
        `claimDate TIMESTAMP, ` +
        `PRIMARY KEY (idx) )`
      );
}