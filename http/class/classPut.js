const mongoose = require('mongoose');
const express = require('express');
const classPut = express.Router();
const dotenv = require('dotenv').config();

mongoose.connect(
    process.env.MONGO,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

let classCollection = mongoose.connection.collection("class");

classPut.put("/", async (req, res) => {
    currentClass = await classCollection.findOne({ _id: req.body._id });
    if (req.body.classSubject)
        currentClass.classSubject = req.body.classSubject;

    if (req.body.classStudents)
        currentClass.classStudents = req.body.classStudents;

    await classCollection.update(currentClass, async (err, res) => {
        if (err) console.log(err);
        err.status(500).send();
    })
    res.status(200).send()
})

module.exports = classPut;