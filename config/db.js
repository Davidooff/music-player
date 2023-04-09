const mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.connect('mongodb://127.0.0.1:27017/music');

module.exports.mongoose = mongoose;
module.exports.Schema = Schema;