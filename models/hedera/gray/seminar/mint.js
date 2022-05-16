const logger = require("../../../../utils/logger");
const dbConnect = require("../../../../db/mysql-connector");

exports.getMintCount = async (seminarNumber) => {
  let sql = `select count(*) as count from hedera_seminar_${seminarNumber}_mint`;
  let connection = await dbConnect.getDBCon();
  let [rows, fields] = await connection.query(sql);
  return rows;
}
exports.insertHederaGraySeminarMint = async (mint, seminarNumber) => {
  let sql = `INSERT INTO hedera_seminar_${seminarNumber}_mint (tokenId, serial, mintAddress) VALUES ('${mint.tokenId}', '${mint.serial}', '${mint.mintAddress}') `;
  logger.info(sql);

  let connection = await dbConnect.getDBCon();
  await connection.query(sql);
  return true;
};

exports.selectHederaGraySeminarMintAddressBySerial = async (serial, seminarNumber) => {
  let sql = `select mintAddress from hedera_seminar_${seminarNumber}_mint where serial = '${serial}' `;
  logger.info(sql);

  let connection = await dbConnect.getDBCon();
  let [rows, fields] = await connection.query(sql);
  return rows;
};

exports.selectHederaGraySeminarMintAddress = async (mintAddress, claim, seminarNumber) => {
  let sql;
  if (claim === null) {
    sql = `select serial, mintAddress, claim from hedera_seminar_${seminarNumber}_mint where mintAddress = '${mintAddress}'`;
  } else {
    sql = `select serial, mintAddress, claim from hedera_seminar_${seminarNumber}_mint where mintAddress = '${mintAddress}' and claim = ${claim}`;
  }
  
  logger.info(sql);
  let connection = await dbConnect.getDBCon();
  let [rows, fields] = await connection.query(sql);
  return rows;
};

exports.updateClaimByMintAddress = async (mintAddress, status, seminarNumber) => {
  let sql = `UPDATE hedera_seminar_${seminarNumber}_mint SET claim = '${status}', claimDate = CURRENT_TIMESTAMP where mintAddress = '${mintAddress}'`;
  logger.info(sql);

  let connection = await dbConnect.getDBCon();
  await connection.query(sql);
  return true;
};

exports.selectMintHistoryByClaim = async (tokenId, claim, seminarNumber) => {
  let sql;
  sql = `select serial, mintAddress from hedera_seminar_${seminarNumber}_mint where claim = ${claim} and tokenId = '${tokenId}'`;
  logger.info(sql);
  let connection = await dbConnect.getDBCon();
  let [rows, fields] = await connection.query(sql);

  return rows;
}