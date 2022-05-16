const logger = require("../utils/logger");
const dbConnect = require("../db/mysql-connector");

dbConnect.getDBCon(function (err, con) {
  if (err) {
    logger.error("fail to get mysql connection");
  }
  con.query(
    "CREATE TABLE IF NOT EXISTS token (" +
      "`idx` int NOT NULL AUTO_INCREMENT, " +
      "`tokenId` varchar(20), " +
      "`fileId` varchar(20), " +
      "`owner` varchar(20), " +
      "`initialOwnerUserEmail` varchar(40), " +
      "`imageUrl` varchar(500), " +
      "`platformType` varchar(20), " +
      "`channelName` varchar(500), " +
      "`subscribers` varchar(20), " +
      "`totalView` varchar(20), " +
      "`description` varchar(500), " +
      "`channelURL` varchar(500), " +
      "`confirm` boolean, " +
      "`ad_register` boolean, " +
      "createDate TIMESTAMP  NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " +
      "PRIMARY KEY (`idx`) " +
      ")",
    function (err) {
      if (err) {
          console.log (err)
        logger.error("user - create error : ", err);
      }
    }
  );
});

exports.insertTokenMetadata = function (token, callback) {
  let sql = `INSERT INTO token (fileId, owner, initialOwnerUserEmail, imageURL, platformType, channelName, subscribers, totalView, description, channelURL, confirm, ad_register) VALUES ('${token.fileId}', '${token.owner}', '${token.initialOwnerEmail}', '${token.imageURL}', '${token.platformType}', '${token.channelName}', '${token.subscribers}', '${token.totalView}', '${token.description}', '${token.channelURL}', ${token.confirm}, ${token.ad_register}) `;
  logger.info(sql);
  dbConnect.getDBCon(function (err, con) {
    if (err) {
      logger.error("fail to get mysql connection");
      return callback(err);
    }
    con.query(sql, function (err, result) {
      if (err) {
        logger.error(err);
        return callback(err);
      }
      return callback(null, result);
    });
  });
};

exports.selectTokenByTokenId = function (token, callback) {
  let sql = `select * from token where tokenId = '${token.tokenId}' `;

  logger.info(sql);
  dbConnect.getDBCon(function (err, con) {
      if (err) {
          logger.error('fail to get mysql connection');
          return callback(err);
      }
      con.query(sql, function (err, result) {
          if (err) {
              logger.error(err);
              return callback(err);
          }
          return callback(null, result);
      });
  });
};

exports.selectTokenByType = function (token, callback) {
  let sql = `select * from token where type = '${token.type}' `;

  logger.info(sql);
  dbConnect.getDBCon(function (err, con) {
      if (err) {
          logger.error('fail to get mysql connection');
          return callback(err);
      }
      con.query(sql, function (err, result) {
          if (err) {
              logger.error(err);
              return callback(err);
          }
          return callback(null, result);
      });
  });
};

exports.selectTokenByOwner = function (token, callback) {
  let sql = `select * from token where owner = '${token.owner}' `;

  logger.info(sql);
  dbConnect.getDBCon(function (err, con) {
      if (err) {
          logger.error('fail to get mysql connection');
          return callback(err);
      }
      con.query(sql, function (err, result) {
          if (err) {
              logger.error(err);
              return callback(err);
          }
          return callback(null, result);
      });
  });
};

exports.updateTokenId = function (token, callback) {
  let sql = `UPDATE token SET tokenId = '${token.tokenId}', owner = '${token.owner}' where fileId = '${token.fileId}' `;
  logger.info(sql);
  dbConnect.getDBCon(function (err, con) {
      if (err) {
          logger.error('fail to get mysql connection');
          return callback(err);
      }
      con.query(sql, function (err, result) {
          if (err) {
              logger.error(err);
              return callback(err);
          }
          return callback(null);
      });
  });
};

exports.updateTokenOwner = function (token, callback) {
  let sql = `UPDATE token SET owner = ('${token.owner}'), confirm = false, ad_register = false where tokenId = '${token.tokenId}' `;
  logger.info(sql);
  dbConnect.getDBCon(function (err, con) {
      if (err) {
          logger.error('fail to get mysql connection');
          return callback(err);
      }
      con.query(sql, function (err, result) {
          if (err) {
              logger.error(err);
              return callback(err);
          }
          return callback(null);
      });
  });
};

exports.updateTokenAdRegisterStatus = function (token, callback) {
  let sql = `UPDATE token SET ad_register = true where tokenId = '${token.tokenId}' `;
  logger.info(sql);
  dbConnect.getDBCon(function (err, con) {
      if (err) {
          logger.error('fail to get mysql connection');
          return callback(err);
      }
      con.query(sql, function (err, result) {
          if (err) {
              logger.error(err);
              return callback(err);
          }
          return callback(null);
      });
  });
};

exports.updateTokenConfirmStatus = function (token, callback) {
  let sql = `UPDATE token SET confirm = true where tokenId = '${token.tokenId}' `;
  logger.info(sql);
  dbConnect.getDBCon(function (err, con) {
      if (err) {
          logger.error('fail to get mysql connection');
          return callback(err);
      }
      con.query(sql, function (err, result) {
          if (err) {
              logger.error(err);
              return callback(err);
          }
          return callback(null);
      });
  });
};

exports.updateTokenPrice = function (token, callback) {
    let sql = `UPDATE token SET price = ('${token.price}') where id = '${token.tokenId}' `;
    logger.info(sql);
    dbConnect.getDBCon(function (err, con) {
        if (err) {
            logger.error('fail to get mysql connection');
            return callback(err);
        }
        con.query(sql, function (err, result) {
            if (err) {
                logger.error(err);
                return callback(err);
            }
            return callback(null);
        });
    });
};