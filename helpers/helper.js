var crypto = require("crypto"); //node js module for data encryption

var algorithm = "AES-128-CBC-HMAC-SHA1",
    key = "ziciGGle";

module.exports.encrypt = function(password) {
    var cipher = crypto.createCipher(algorithm, key)
    var crypted = cipher.update(password, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
};
module.exports.uuidv4 = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, 
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}