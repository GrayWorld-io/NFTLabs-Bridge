const mysql = require('mysql2/promise');

const logger = require('../utils/logger');

let mysqlConfig = {
    host: process.env.MYSQL_URL,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    enableKeepAlive: true
};

let con;    // provide db connection
async function connect() {
    con = mysql.createPool(mysqlConfig);
    return await con.getConnection();
}

function handleDisconnect(client) {
    client.on('error', function (err) {
        logger.warn('> disconnected mysql error code: ' + err.code);

        if (!err.fatal) return;
        if (err.code !== 'PROTOCOL_CONNECTION_LOST' && err.code !== 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') throw err;

        logger.warn('> reconnecting lost mysql connection');
        if (con) { con.destroy(); }
        con = null;
        connect(function (err) {
            if (err) {
                logger.error('> reconnect failed');
                if (con) { con.destroy(); }
                con = null;
            }
            logger.warn('> reconnect done');
        });
    });
}

exports.getDBCon = async () => {
    if (!con) {
        return await connect();
    } else {
        return con;
    }
};