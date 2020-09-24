const mongoose = require('mongoose');
require('../../../DAL/mongoose');
const express = require('express');
const userPut = express.Router();
const bcrypt = require('bcryptjs');
require('dotenv').config();
const auth = require('../auth');

let userCollection = mongoose.connection.collection("user");

userPut.patch("/api/user/:id/settings/edit", auth, async (req, res) => {
    try {
        if (req.body.email) {
            if (await userCollection.findOne({ email: req.body.email }))
                return res.status(401).send("Email already exists");

            await userCollection.updateOne({ _id: req.body._id }, { $set: { email: req.body.email } });
        }
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            await userCollection.updateOne({ _id: req.body._id }, { $set: { password: hashedPassword } });
        }
        if (req.body.nickName)
            await userCollection.updateOne({ _id: req.body._id }, { $set: { nickName: req.body.nickName } });
    }
    catch (err) {
        res.status(500).send();
    }
    res.status(200).send();
});

module.exports = userPut;