const crypto = require("crypto");
require("dotenv").config();

let key =
  "302e020100300506032b657004220420832502c0dade4d169d52d276982a11dce5323260b74b629098d758c4bec14b10";
let key2 = "302e020100300506032b657004220420e881fe2c6b8351cd6856890606909809d7214f1f522abf03dea373f9242abe2f";
const cipher = crypto.createCipher("aes-256-cbc", process.env.PK_SECRET_KEY);
let result = cipher.update(key, "utf8", "base64"); // 'HbMtmFdroLU0arLpMflQ'
result += cipher.final("base64"); // 'HbMtmFdroLU0arLpMflQYtt8xEf4lrPn5tX5k+a8Nzw='

// console.log(result);
const decipher = crypto.createDecipher(
  "aes-256-cbc",
  process.env.PK_SECRET_KEY
);
let result2 = decipher.update('RzLg0Ogcv2mYWprq/0GKi4CaAGVjiRAq1LfrFyQf8o6pz1va0mryeSkeJSYdLVbW/oRbhcjpPvXKFK02jP0BKn3aPi+0o42LNf481cDUawQAoneDNqnB4QZntNyuKAD4lH3ioQBgXIcrFUGlB2z24A==', "base64", "utf8"); // 암호화할문 (base64, utf8이 위의 cipher과 반대 순서입니다.)
result2 += decipher.final("utf8"); // 암호화할문장 (여기도 base64대신 utf8)
// console.log(result2);

exports.encrypt = function (key, callback) {
  const cipher = crypto.createCipher("aes-256-cbc", process.env.PK_SECRET_KEY);
  let result = cipher.update(key, "utf8", "base64"); // 'HbMtmFdroLU0arLpMflQ'
  result += cipher.final("base64"); // 'HbMtmFdroLU0arLpMflQYtt8xEf4lrPn5tX5k+a8Nzw='
  return callback(null, result);  
};

exports.decrypt = function(encKey, callback) {
  const decipher = crypto.createDecipher(
    "aes-256-cbc",
    process.env.PK_SECRET_KEY
  );
  let result;
  try {
    let key = encKey.replace(" ", "+");
    result = decipher.update(key, "base64", "utf8"); // 암호화할문 (base64, utf8이 위의 cipher과 반대 순서입니다.)
    result += decipher.final("utf8"); // 암호화할문장 (여기도 base64대신 utf8)
  } catch (e) {
    return callback(e);
  }
  return callback(null, result);
};
