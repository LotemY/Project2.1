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
let pointsObj = {};
classP.post("/api/teacherHP/:id/newClass", auth, async (req, res) => {
    let sutdentCounter = 0;
    let reqCounter = 0;
    let newClass = new classSchema({
        _id: thisId,
        className: req.body.className,
        grade: req.body.grade,
        classTeacher: req.body.classTeacher,
        rewards: req.body.rewards
    });

    if (req.body.classSubject)
        newClass.classSubject = req.body.classSubject;

    try {
        while (await classCollection.findOne({ _id: newClass._id })) {
            thisId++;
            newClass._id = thisId;
        }
        while (reqCounter < req.body.classStudents.length) {
            let user = await userCollection.findOne({ _id: String(req.body.classStudents[reqCounter]._id) })
            if (user) {
                user.points = [];
                for (let s = 0; s < newClass.classSubject.length; s++) {
                    pointsObj.name = newClass.classSubject[s].name;
                    pointsObj.points = 0;
                    user.points[s] = pointsObj;
                    pointsObj = {};
                }
                newClass.classStudents[sutdentCounter] = user;
                sutdentCounter++;
            }
            reqCounter++;
        }

        await classCollection.insertOne(newClass, async (err, res) => {
            if (err) return console.log(err);
        })
        res.status(201).send(newClass);
    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = classP;
