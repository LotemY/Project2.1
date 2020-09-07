const classSchema = require('../../Schemas/class');
const mongoose = require('mongoose');
const express = require('express');
const classP = express.Router();
const dotenv = require('dotenv').config();

mongoose.connect(
    process.env.MONGO,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

let classCollection = mongoose.connection.collection("class");
let thisId=10;
classP.post("/", async (req, res) => {

    let newClass = new classSchema({
        _id: thisId,
        className: req.body.className,
        grade: req.body.grade,
        classSubject: req.body.classSubject,
        classTeacher: req.body.classTeacher,
    });
    if (req.body.classStudents) {
        newClass.classStudents = req.body.classStudents
    }

    try {
        while (await classCollection.findOne({ _id: newClass._id })) {
            thisId++;
            newClass._id = thisId;
        }
        await classCollection.insertOne(newClass, async (err, res) => {
            if (err) return console.log(err);
        })
        res.status(201).send({ "msg": "success" });
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = classP;
