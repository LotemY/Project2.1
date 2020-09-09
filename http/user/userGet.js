const mongoose = require('mongoose');
const express = require('express');
const userG = express.Router();
const dotenv = require('dotenv').config();
const auth = require('../auth');
let userCollection = mongoose.connection.collection("user");

mongoose.connect(
    process.env.MONGO,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

userG.get(`/studentHP/:id`, auth, async (req, res) => {
    let user = await userCollection.findOne({ _id: req.params.id });
    res.status(200).send(user);
});
userG.get(`/teacherHP/:id`, auth, async (req, res) => {
    let user = await userCollection.findOne({ _id: req.params.id });
    res.status(200).send(user);
});


module.exports = userG;

