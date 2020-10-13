const mongoose = require('mongoose');
require('../../../DAL/mongoose');
const express = require('express');
const classPut = express.Router();
require('dotenv').config();
const auth = require('../auth');

let classCollection = mongoose.connection.collection("class");
let userCollection = mongoose.connection.collection("user");

let pointsObj = {};
classPut.patch("/api/teacherHP/:id/tClass/:cId/edit", auth, async (req, res) => {
    try {
        let iClass = await classCollection.findOne({ _id: req.body._id });
        let tempClass = [];

        if (iClass.grade != req.body.grade)
            await classCollection.updateOne({ _id: iClass._id }, { $set: { grade: req.body.grade } });

        if (iClass.className != req.body.className)
            await classCollection.updateOne({ _id: iClass._id }, { $set: { className: req.body.className } });

        await classCollection.updateOne({ _id: iClass._id }, { $set: { classSubject: req.body.classSubject } });
        await classCollection.updateOne({ _id: iClass._id }, { $set: { rewards: req.body.rewards } });
        let reqCounter = 0;

        for (let i = 0; i < req.body.classStudents.length; i++) {
            let user = await userCollection.findOne({ _id: req.body.classStudents[i]._id })
            let temp = {};
            if (user) {
                temp._id = user._id;
                temp.firstName = user.firstName;
                temp.lastName = user.lastName;
                temp.subPoints = [];
                temp.classPoints = 0;

                if (req.body.classStudents[i]._id == temp._id)
                    temp.classPoints = req.body.classStudents[i].classPoints;
                for (let p = 0; p < req.body.classStudents[i].subPoints.length; p++)
                    for (let f = 0; f < req.body.classSubject.length; f++)
                        if (req.body.classStudents[i].subPoints[p].subName == req.body.classSubject[f].name) {
                            pointsObj.subName = req.body.classStudents[i].subPoints[p].subName;
                            pointsObj.points = req.body.classStudents[i].subPoints[p].points;
                            temp.subPoints[f] = pointsObj;
                            pointsObj = {};
                            break;
                        }
                tempClass[reqCounter] = temp;
                reqCounter++;
            }
        }
        await classCollection.updateOne({ _id: iClass._id }, { $set: { classStudents: tempClass } });
    }
    catch (err) {
        console.log(err)
        res.status().send();
    }
    res.status(200).send();
});

classPut.patch("/api/updatePoints/:id", auth, async (req, res) => {
    try {
        await classCollection.updateOne({ _id: req.body._id }, { $set: { classSubject: req.body.classSubject } });
        await classCollection.updateOne({ _id: req.body._id }, { $set: { classStudents: req.body.classStudents } });
    }
    catch (err) {
        console.log(err)
        res.status(400).send();
    }
    res.status(200).send();
})

module.exports = classPut;