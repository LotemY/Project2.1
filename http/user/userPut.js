const userSchema = require('../../Schemas/User');
const mongoose = require('mongoose');
const express = require('express');
const userPut = express.Router();
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv').config();

mongoose.connect(
    process.env.MONGO,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

let userCollection = mongoose.connection.collection("user");

userPut.patch("/teacherHP/:id", async (req, res) => {
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