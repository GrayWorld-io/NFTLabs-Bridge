const logger = require('../utils/logger');
const dbConnect = require('../db/mysql-connector');

dbConnect.getDBCon(function (err, con) {
    if (err) {
        logger.error('fail to get mysql connection');
        return;
    }
    con.query("CREATE TABLE IF NOT EXISTS user (" +
        "`id` int NOT NULL AUTO_INCREMENT, " +
        "`email` varchar(100), " +
        "`password` varchar(20), " +
        "`publicKey` varchar(100), " +
        "`accountId` varchar(20), " +
        "PRIMARY KEY (`id`) " +
        ")", function (err) {
            if (err) { logger.error('user - create error : ', err); }
        }
    );
});

exports.selectUserByAuth = function (user, callback) {
    let sql = `select * from user where email = '${user.email}' and password = '${user.password}' `;

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

exports.selectUserByAccountId = function (user, callback) {
    let sql = `select * from user where accountId = '${user.accountId}' `;

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

exports.insertUser = function (user, callback) {
    let sql = `INSERT INTO user (email, password, publicKey, accountId) VALUES ('${user.email}', '${user.password}', '${user.publicKey}', '${user.accountId}') `;
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

// exports.updateUserHederaAccount = function (tx, id, signature, callback) {
//     let sql = `UPDATE user SET transaction = ('${tx}') where id = ${id} `;
//     logger.info(sql);
//     dbConnect.getDBCon(function (err, con) {
//         if (err) {
//             logger.error('fail to get mysql connection');
//             return callback(err);
//         }
//         con.query(sql, function (err, result) {
//             if (err) {
//                 logger.error(err);
//                 return callback(err);
//             }
//             return callback(null, signature);
//         });
//     });
// };