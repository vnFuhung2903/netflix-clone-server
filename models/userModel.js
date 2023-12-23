const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    phone: String,
    name: String,
    token: String,
    list: [{
        type: String,
        feature: Object
    }],
    recently: [{
        type: String,
        feature: Object
    }]
}, { typeKey : '$type' })

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;