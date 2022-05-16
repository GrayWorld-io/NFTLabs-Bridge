const response_status = {
    1: 'OK',
    9999: 'unknown server error'
};

exports.getResponse = function (result, data) {
    let body = {};
    if (result === null) {
        result = 9999;
    }
    body.result = result;
    if (result === 1) {
        body.err_message = response_status[result];
    } else {
        body.err_message = data.toString();
    }
    if (typeof (data) === 'undefined') {
        body.data = '';
    } else {
        body.data = data;
    }
    return body;
};