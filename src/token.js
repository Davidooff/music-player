const jwt = require('jsonwebtoken');
const fs = require('fs')
const privateKey = fs.readFileSync('../config/private.key');

function createToken(_id){
    return  jwt.sign(_id, privateKey, { expiresIn: '1h' });
}

function checkToken(token){
    return jwt.verify(token, privateKey)
}


module.exports.createToken = createToken;
module.exports.checkToken = checkToken;