const mongoose = require('mongoose');
require('../../../DAL/mongoose');
const express = require('express');
const userG = express.Router();
const auth = require('../auth');
const jwt = require('jsonwebtoken');
let userCollection = mongoose.connection.collection("user");

userG.get(`/api/user/:id`, auth, async (req, res) => {
    try {
        let id = jwt.verify(req.header("token"), process.env.SECRET_TOKEN)._id;
        let user = await userCollection.findOne({ _id: id });
        res.status(200).send(user);
    }
    catch (err) {
        res.status(401).send();
    }
});

module.exports = userG;

