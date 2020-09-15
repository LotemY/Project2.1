const mongoose = require('mongoose');
require('../../../DAL/mongoose');
const express = require('express');
const classPut = express.Router();
require('dotenv').config();
const auth = require('../auth');

let classCollection = mongoose.connection.collection("class");

classPut.put("/", async (req, res) => {
    try {
        currentClass = await classCollection.findOne({ _id: req.body._id });

        res.status(200).send()
    }
    catch (err) {
        res.status(404).send();
    }
})

module.exports = classPut;