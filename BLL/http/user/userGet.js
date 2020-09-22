const mongoose = require('mongoose');
require('../../../DAL/mongoose');
const express = require('express');
const userG = express.Router();
const auth = require('../auth');
const jwt = require('jsonwebtoken');
let userCollection = mongoose.connection.collection("user");

userG.get(`/api/user`, async (req, res) => {
    let id = jwt.verify(req.header("token"), process.env.SECRET_TOKEN)._id;
    let user = await userCollection.findOne({ _id: id });
    res.status(200).send(user);
});

userG.get(`/api/login`, async (req, res) => {
    let token = req.header("token");
    try {
        let id = jwt.verify(token, process.env.SECRET_TOKEN)._id;
        let user = await userCollection.findOne({ _id: id });
        return res.send(user);
    }
    catch (err) {
        res.send("token has exprired");
    }
})

module.exports = userG;

