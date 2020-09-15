const mongoose = require('mongoose');
require('../../../DAL/mongoose');
const express = require('express');
const userPut = express.Router();
const bcrypt = require('bcryptjs');
require('dotenv').config();
const auth = require('../auth');

let userCollection = mongoose.connection.collection("user");

userPut.patch("/teacherHP/:id", auth, async (req, res) => {
    await userCollection.findOne({ _id: req.body._id }, async (err, user) => {
        if (err)
            return res.status(404).send(err);

        if (req.body.email) {
            await userCollection.updateOne({ _id: user._id }, { $set: { email: req.body.email } });
            user.email = req.body.email;
        }
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            await userCollection.updateOne({ _id: user._id }, { $set: { password: hashedPassword } });
            user.password = req.body.password;
        }
        return res.status(200).send(user);
    });
});

userPut.patch("/studentHP/:id", auth, async (req, res) => {
    try {
        if (req.body.email)
            await userCollection.updateOne({ _id: req.body._id }, { $set: { email: req.body.email } });

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            await userCollection.updateOne({ _id: req.body._id }, { $set: { password: hashedPassword } });
        }
        if (req.body.nickName)
            await userCollection.updateOne({ _id: req.body._id }, { $set: { nickName: req.body.nickName } });
    }

    catch (err) {
        res.status(500).send(err);
    }
    res.status(200).send()
})

module.exports = userPut;