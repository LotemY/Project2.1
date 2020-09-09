const mongoose = require('mongoose');
const express = require('express');
const userD = express.Router();
const dotenv = require('dotenv').config();
const auth = require('../auth');

mongoose.connect(
    process.env.MONGO,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

let userCollection = mongoose.connection.collection("user");

userD.delete(`/teacherHP/:id`, auth, async (req, res) => {
    await userCollection.deleteOne({ _id: req.params.id }, async (err, res) => {
        if (err) return res.status(500).send();
    });
    res.status(200).send();
})

userD.delete(`/studentHP/:id`, auth, async (req, res) => {
    await userCollection.deleteOne({ _id: req.params.id }, async (err, res) => {
        if (err) return res.status(500).send();
    });
    res.status(200).send();
})
module.exports = userD;