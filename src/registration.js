const userModel = require('../config/models/user')

async function registration(login, password, callback){
    let found = await userModel.findById(login).exec()
    if(!found){
        userModel.genSalt(password,async (error, hash) => {
            if (!error) {
                await userModel.create({
                    _id: login,
                    password: hash
                })
                let found = await userModel.findById(login).exec()
                if (found) {
                    callback(null, found)
                } else{
                    callback("Can't check on complit", null)
                }
            }
        })
    } else{
        callback("User already exist", null)
    }
}

module.exports.reg = registration;
