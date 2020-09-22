const mongoose = require('mongoose');
require('../../../DAL/mongoose');
const express = require('express');
const classPut = express.Router();
require('dotenv').config();
const auth = require('../auth');

let classCollection = mongoose.connection.collection("class");

classPut.patch("/api/teacherHP/:id/tClass/:cId/edit", async (req, res) => {
    try {
        await classCollection.findOne({ _id: req.body._id }, async (err, iClass) => {
            if (err)
                return res.status(404).send(err);

            if (iClass.grade != req.body.grade)
                await classCollection.updateOne({ _id: iClass._id }, { $set: { grade: req.body.grade } });
            if (iClass.className != req.body.className)
                await classCollection.updateOne({ _id: iClass._id }, { $set: { className: req.body.className } });
            await classCollection.updateOne({ _id: iClass._id }, { $set: { classStudents: req.body.classStudents } });
            await classCollection.updateOne({ _id: iClass._id }, { $set: { classSubject: req.body.classSubject } });
        });
    }
    catch (err) {
        res.status(500).send();
    }
    res.status(200).send();
});


module.exports = classPut;