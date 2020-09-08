const mongoose = require('mongoose');

const userPostSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    nickName: {
        type: String
    },
    token: {
        type: String
    }
});

let user = mongoose.model('user', userPostSchema, "user");

module.exports = user;
