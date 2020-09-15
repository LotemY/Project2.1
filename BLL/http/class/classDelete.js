const mongoose = require('mongoose');
require('../../../DAL/mongoose');
const express = require('express');
const classD = express.Router();
require('dotenv').config();

let classCollection = mongoose.connection.collection("class");

classD.delete("/", async (req, res) => {
    if (await classCollection.findOne({ _id: req.body._id })) {
        classCollection.deleteOne(req.body._id);
        res.status(200).send("Class Got Delete");
    }
    else
        res.status(500).send();
})

module.exports = classD;