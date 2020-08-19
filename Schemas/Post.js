const mongoose = require('mongoose');

const userPostSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

let user = mongoose.model('user', userPostSchema, "user");

module.exports = user;
