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
        rewards: req.body.rewards,
        img: "../../assets/gen.jpg"
    });

    let hebrewArr = [`אזרחות`, `אנגלית`, `ביולוגיה`, `גיאוגרפיה`, `היסטוריה`, `חנ"ג`, `כימיה`, `מוסיקה`, `מתמטיקה`, `פיזיקה`, `ספרות`, `עברית`, `תנ"ך`];
    let englishArr = ["Citizenship.jpg", "English.jpg", "Biology.jpg", "Geography.jpg", "History.jpg", "Sport.jpg", "Chmistry.jpg", "Music.jpg", "Math.jpg", "Physics.jpg", "Literature.jpg", "Hebrew.jpg", "Tanach.jpg"];


    for (let i = 0; i < hebrewArr.length; i++)
        if (req.body.className.split(" ")[0] == hebrewArr[i]) {
            newClass.img = "../../assets/" + englishArr[i];
            break;
        }

    if (req.body.classSubject)
        newClass.classSubject = req.body.classSubject;

    try {
        while (await classCollection.findOne({ _id: newClass._id })) {
            thisId++;
            newClass._id = thisId;
        }
        while (reqCounter < req.body.classStudents.length) {
            try {
                let user = await userCollection.findOne({ _id: String(req.body.classStudents[reqCounter]._id) });
                let len = 0;
                if (!user.classPoints)
                    user.classPoints = [];

                else
                    len = user.classPoints.length;
                user.classPoints[len] = {};
                user.classPoints[len].id = newClass._id;
                user.classPoints[len].points = 0;

                await userCollection.updateOne({ _id: user._id }, { $set: { classPoints: user.classPoints } });

                user.subPoints = [];
                user.classPoints = 0;
                user.reason = [];
                user.email = undefined;
                user.password = undefined;
                user.nickName = undefined;
                user.token = undefined;
                user.totalPoints = undefined;
                for (let s = 0; s < newClass.classSubject.length; s++) {
                    pointsObj.subName = newClass.classSubject[s].name;
                    pointsObj.points = 0;
                    user.subPoints[s] = pointsObj;
                    pointsObj = {};
                }
                newClass.classStudents[sutdentCounter] = user;
                sutdentCounter++;
            }
            catch(err){};
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
