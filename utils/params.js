
exports.format = {
    any: /(\w*)/,
    bool: /^true|false$/,
    int: /^(\d+)$/,
    string: /^(\w+)$/,
    text: /^([^]{0,3000})$/,
    tinyText: /^([^]{0,64})$/,
    address: /^(0x([a-z0-9]{40}))|([a-zA-HJ-NP-Z0-9]{26,98})$/,
};

exports.check = function (json, ref) {
    if (typeof json !== 'object') {
        if (!ref.test(json)) {
            throw new Error('incorrect values: ' + json);
        }
        return;
    }
    for (var key in ref) {
        if (!json.hasOwnProperty(key)) {
            throw new Error('incorrect keys: ' + key);
        } else {
            this.check(json[key], ref[key]);
        }
    }

};