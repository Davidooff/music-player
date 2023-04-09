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
                    callback(found)
                }
            }
        })
    }
}

registration('david', '123', (found) => console.log('Ok'))
