const userSchema = require('../../Schemas/Post');
const mongoose = require('mongoose');
const express = require('express');
const userP = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(
    process.env.MONGO,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

let userCollection = mongoose.connection.collection("user");
let tId = 999;
let sId = 999;
let thisId;
let SorT;

userP.post("/signUp", async (req, res) => {
    if (await userCollection.findOne({ email: req.body.email }))
        return res.status(400).send("Email already exists");

    idFunc();

    function idFunc() {
        if (req.body.nickName) {
            sId++;
            thisId = sId;
            SorT = "";
        }
        else {
            tId++;
            thisId = tId;
            SorT = "t";
        }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    let newUser = new userSchema({
        _id: thisId + SorT,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword
    });
    if (req.body.nickName) {
        newUser.nickName = req.body.nickName
    }

    try {
        while (await userCollection.findOne({ _id: newUser._id })) {
            idFunc()
            newUser._id = thisId + SorT;
        }
        await userCollection.insertOne(newUser, async (err, res) => {
            if (err) return console.log(err);
        })
        res.status(201).send({ "msg": "success" });
    } catch (err) {
        res.status(500).send(err)
    }
})

userP.post("/login", async (req, res) => {
    await userCollection.findOne({ email: req.body.email },
        async (err, user) => {
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
            res.header('auth-token', token);

            return res.status(200).send();
        })
})

module.exports = userP;

