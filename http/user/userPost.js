const userSchema = require('../../Schemas/User');
const mongoose = require('mongoose');
const express = require('express');
const userP = express.Router();
const jwt = require('jsonwebtoken');
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
let tempId = "";
let numberId = 0;

userP.post("/register", async (req, res) => {
    if (await userCollection.findOne({ email: req.body.email }))
        return res.status(400).send("Email already exists");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    let newUser = new userSchema({
        _id: req.body._id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword
    });
    if (req.body.nickName)
        newUser.nickName = req.body.nickName;

    try {
        while (await userCollection.findOne({ _id: newUser._id })) {
            if (newUser.nickName) {
                numberId = parseInt(newUser._id);
                numberId++;
                newUser._id = numberId;
            }
            else {
                tempId = newUser._id.split("t")[0];
                numberId = parseInt(tempId);
                numberId++;
                newUser._id = numberId + "t";
            }
        }
        await userCollection.insertOne(newUser, async (err, res) => {
            if (err) return console.log(err);
        })
        res.status(201).send();
    } catch (err) {
        res.status(500).send(err)
    }
})

userP.post("/login", async (req, res) => {
    await userCollection.findOne({ email: req.body.email }, async (err, user) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        if (!user)
            return res.status(404).send("User not found");

        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass)
            return res.status(400).send("Invalid password");

        const token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN);
        user.token = token;
        res.header("token", token);
        res.status(200).send(user);
    })
})

module.exports = userP;
