const logger = require("../../../utils/logger");
const dbConnect = require("../../../db/mysql-connector");

exports.selectHederaFreshmManMetadata = async (serial) => {
  let sql = `select cid from hedera_freshman_metadata where idx = '${serial}' `;
  logger.info(sql);

  let connection = await dbConnect.getDBCon();
  let [rows, fields] = await connection.query(sql);
  return rows;
};

// exports.updateTokenOwner = function (mint, callback) {
//   let sql = `UPDATE hedera_freshman_mint SET owner = ('${mint.owner}')`;
//   logger.info(sql);
//   dbConnect.getDBCon(function (err, con) {
//       if (err) {
//           logger.error('fail to get mysql connection');
//           return callback(err);
//       }
//       con.query(sql, function (err, result) {
//           if (err) {
//               logger.error(err);
//               return callback(err);
//           }
//           return callback(null);
//       });
//   });
// };