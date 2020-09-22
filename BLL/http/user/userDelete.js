const mongoose = require('mongoose');
const express = require('express');
const userD = express.Router();
require('../../../DAL/mongoose');
require('dotenv').config();
const auth = require('../auth');

let userCollection = mongoose.connection.collection("user");

userD.delete(`/api/teacherHP/:id`, async (req, res) => {
    await userCollection.deleteOne({ _id: req.params.id }, async (err, res) => {
        if (err) return res.status(500).send();
    });
    res.status(200).send();
})

userD.delete(`/api/studentHP/:id`, async (req, res) => {
    await userCollection.deleteOne({ _id: req.params.id }, async (err, res) => {
        if (err) return res.status(500).send();
    });
    res.status(200).send();
})
module.exports = userD;