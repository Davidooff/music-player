let { mongoose, Schema} = require('../db')
var bcrypt = require('bcryptjs');

const userSchema = new Schema(
    { 
        _id: String,
        password: String,
        library: [{
            originalName: String,
            platform: String,
            link: String,
        }],
        playLists: [{
            name: String,
            songs: [
                {
                    name: String,
                    originalName: String,
                    platform: String,
                    link: String,
                }
            ]
        }],
        date: { type: Date, default: Date.now }
    },
    {
        statics: {
            genSalt(password, callback){
                bcrypt.genSalt(10, function(error, salt) { // генерим соль >> передаем ее в колбек
                    bcrypt.hash(password, salt, function(error, hash) { // берем пароль + соль и генерим хеш
                        // получаем хеш и сохраняем в БД
                        callback(error, hash)
                    });
                });
            }
        }
    }
)

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;