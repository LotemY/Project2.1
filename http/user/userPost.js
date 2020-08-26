const userSchema = require('../../Schemas/Post');
const mongoose = require('mongoose');
const express = require('express');
const userP = express.Router();

mongoose.connect(
    'mongodb://127.0.0.1:27017/project',
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

    let newUser = new userSchema({
        _id: thisId + SorT,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });
    if (req.body.nickName) {
        newUser.nickName = req.body.nickName
    }

    try {
        userCollection.insert(newUser, function (err, res) {
            console.log(res);
            if (err) return console.log(err);
        })
        res.status(201).send({ "msg": "success" });
    } catch (err) {
        res.status(500).send(err)
    }
})
let bool;
userP.post("/login", async (req, res) => {
    userCollection.findOne({ email: req.body.email, password: req.body.password },
        function (err, user) {
            if (err) {
                console.log(err);
                return res.status(500).send();
            }
            if (!user)
                return res.status(404).send();

            bool = user;
            return res.status(200).send();
        })
})

module.exports = userP;

