const mongoose = require('mongoose');
require('../../../DAL/mongoose');
const express = require('express');
const classD = express.Router();
require('dotenv').config();
const auth = require('../auth');

let classCollection = mongoose.connection.collection("class");

classD.delete("/api/teacherHP/:id/tClass/:cId/edit", auth, async (req, res) => {
    await classCollection.deleteOne({ _id: req.params.cId }, async (err, res) => {
        if (err) return res.status(500).send();
    });
    res.status(200).send();
})

module.exports = classD;