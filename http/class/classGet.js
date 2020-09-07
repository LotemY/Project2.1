const mongoose = require('mongoose');
const express = require('express');
const classG = express.Router();
const dotenv = require('dotenv').config();

mongoose.connect(
    process.env.MONGO,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
/*
classG.get('/', (req, res) => {
    console.log("get req" + req.body);
});
*/

module.exports = classG;

