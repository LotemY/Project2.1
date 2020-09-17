const mongoose = require('mongoose');
require('../../../DAL/mongoose');
const express = require('express');
const classD = express.Router();
require('dotenv').config();

let classCollection = mongoose.connection.collection("class");

classD.delete("/teacherHP/:id/tClass/:cId/edit", async (req, res) => {
    await classCollection.deleteOne({ _id: req.params.cId }, async (err, res) => {
        if (err) return res.status(500).send();
    });
    res.status(200).send();
})

module.exports = classD;