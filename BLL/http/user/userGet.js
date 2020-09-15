const mongoose = require('mongoose');
require('../../../DAL/mongoose');
const express = require('express');
const userG = express.Router();
const auth = require('../auth');
const jwt = require('jsonwebtoken');
let userCollection = mongoose.connection.collection("user");

/*
userG.get(`/studentHP/:id`, async (req, res) => {
    let user = await userCollection.findOne({ _id: req.params.id });
    res.status(200).send(user);
});
userG.get(`/teacherHP/:id`,auth, async (req, res) => {
    let user = await userCollection.findOne({ _id: req.params.id });
    res.status(200).send(user);
});
*/

userG.get(`/login`, async (req, res) => {
    let id;
    let token = req.header("token");
    try {
        id = jwt.verify(token, process.env.SECRET_TOKEN)._id;
        let user = await userCollection.findOne({ _id: id });
        return res.send(user);
    }
    catch (err) {
        res.send("token has exprired");
    }
})

module.exports = userG;

