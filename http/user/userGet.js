const mongoose = require('mongoose');
const express = require('express');
const userG = express.Router();

mongoose.connect(
    'mongodb://127.0.0.1:27017/project',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

let userCollection = mongoose.connection.collection("user");


module.exports = userG;

