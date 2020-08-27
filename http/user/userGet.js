const mongoose = require('mongoose');
const express = require('express');
const userG = express.Router();
const auth = require('../auth');

mongoose.connect(
    'mongodb://127.0.0.1:27017/project',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

userG.get('/HomePage', auth, (req, res) => {
    res.send(req.user);
});

module.exports = userG;

