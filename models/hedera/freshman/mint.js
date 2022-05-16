const logger = require("../../../utils/logger");
const dbConnect = require("../../../db/mysql-connector");

exports.insertHederaFreshManMint = async (mint) => {
  let sql = `INSERT INTO hedera_freshman_mint (tokenId, serial, mintAddress) VALUES ('${mint.tokenId}', '${mint.serial}', '${mint.mintAddress}') `;
  logger.info(sql);

  let connection = await dbConnect.getDBCon();
  await connection.query(sql);
  return true;
};

exports.selectHederaFreshmManMintAddressBySerial = async (serial) => {
  let sql = `select mintAddress from hedera_freshman_mint where serial = '${serial}' `;
  logger.info(sql);

  let connection = await dbConnect.getDBCon();
  let [rows, fields] = await connection.query(sql);
  return rows;
};

exports.selectHederaFreshmManMintAddress = async (mintAddress, claim) => {
  let sql = `select serial, mintAddress, claim from hedera_freshman_mint where mintAddress = '${mintAddress}' and claim = ${claim}`;
  logger.info(sql);
  let connection = await dbConnect.getDBCon();
  let [rows, fields] = await connection.query(sql);
  return rows;
};

exports.updateClaimByMintAddress = async (mintAddress, status) => {
  let sql = `UPDATE hedera_freshman_mint SET claim = ('${status}') where mintAddress = '${mintAddress}'`;
  logger.info(sql);

  let connection = await dbConnect.getDBCon();
  await connection.query(sql);
  return true;
};