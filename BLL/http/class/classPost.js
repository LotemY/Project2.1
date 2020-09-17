const classSchema = require('../../../DAL/Schemas/class');
const mongoose = require('mongoose');
require('../../../DAL/mongoose');
const express = require('express');
const classP = express.Router();
require('dotenv').config();
const auth = require('../auth');

let classCollection = mongoose.connection.collection("class");
let userCollection = mongoose.connection.collection("user");

let thisId = 10;

classP.post("/teacherHP/:id/newClass", async (req, res) => {
    let students = []
    let sutdentCounter = 0;
    let reqCounter = 0;
    let newClass = new classSchema({
        _id: thisId,
        className: req.body.className,
        grade: req.body.grade,
        classTeacher: req.body.classTeacher
    });

    if (req.body.classSubject)
        newClass.classSubject = req.body.classSubject;

    try {
        while (await classCollection.findOne({ _id: newClass._id })) {
            thisId++;
            newClass._id = thisId;
        }
        while (reqCounter < 40) {
            if (await userCollection.findOne({ _id: req.body.classStudents[reqCounter] })) {
                students[sutdentCounter] = req.body.classStudents[reqCounter];
                sutdentCounter++;
            }
            reqCounter++;
        }

        newClass.classStudents = students;

        await classCollection.insertOne(newClass, async (err, res) => {
            if (err) return console.log(err);
        })
        res.status(201).send(newClass);
    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = classP;
