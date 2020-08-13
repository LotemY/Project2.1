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

const getSchema = mongoose.Schema({
   
});

module.exports = mongoose.model('Posts',userPostSchema);
