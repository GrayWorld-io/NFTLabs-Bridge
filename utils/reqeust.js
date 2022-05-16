const request = require('request');
const logger = require('../utils/logger');

// exports.post = function (prefix, id, req, callback) {
//     'use strict';
//     request.post(req, function (err, res, body) {
//         if (!err && res.statusCode === 200) {
//             console.log(id, 'POST : result ok');
//             console.log(id, 'POST : body=' + JSON.stringify(body));
//             return callback(null, body);
//         } else if (err) {
//             console.log(id, 'POST : result ERR');
//         } else {
//             console.log(id, 'POST : result HTTP statusCode=', res.statusCode);
//         }
//     });
// };

exports.get = function (prefix, options, callback) {
    request.get(options, function (err, res, body) {
        if (err) {
            return callback(new error(err, 4000));
        }
        if (res.statusCode !== 200) {
            logger.error(res);
            logger.error('error' + res.statusCode);
        }
        logger.info(prefix + JSON.stringify(body));
        return callback(null, body);
    });
};
