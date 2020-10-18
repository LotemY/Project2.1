const mongoose = require('mongoose');
require('../../../DAL/mongoose');
const express = require('express');
const classPut = express.Router();
require('dotenv').config();
const auth = require('../auth');

let classCollection = mongoose.connection.collection("class");
let userCollection = mongoose.connection.collection("user");

classPut.patch("/api/teacherHP/:id/tClass/:cId/edit", auth, async (req, res) => {
    try {
        let iClass = await classCollection.findOne({ _id: req.body._id });

        if (iClass.grade != req.body.grade)
            await classCollection.updateOne({ _id: iClass._id }, { $set: { grade: req.body.grade } });

        if (iClass.className != req.body.className) {
            await classCollection.updateOne({ _id: iClass._id }, { $set: { className: req.body.className } });
            let hebrewArr = [`אזרחות`, `אנגלית`, `ביולוגיה`, `גיאוגרפיה`, `היסטוריה`, `חנ"ג`, `כימיה`, `מוסיקה`, `מתמטיקה`, `פיזיקה`, `ספרות`, `עברית`, `תנ"ך`];
            let englishArr = ["Citizenship.jpg", "English.jpg", "Biology.jpg", "Geography.jpg", "History.jpg", "Sport.jpg", "Chmistry.jpg", "Music.jpg", "Math.jpg", "Physics.jpg", "Literature.jpg", "Hebrew.jpg", "Tanach.jpg"];

            iClass.img = "../../assets/gen.jpg";
            await classCollection.updateOne({ _id: iClass._id }, { $set: { img: iClass.img } });

            for (let i = 0; i < hebrewArr.length; i++)
                if (req.body.className.split(" ")[0] == hebrewArr[i]) {
                    iClass.img = "../../assets/" + englishArr[i];
                    await classCollection.updateOne({ _id: iClass._id }, { $set: { img: iClass.img } });
                    break;
                }
        }

        await classCollection.updateOne({ _id: iClass._id }, { $set: { rewards: req.body.rewards } });
        await classCollection.updateOne({ _id: iClass._id }, { $set: { classSubject: req.body.classSubject } });

        let b = 0;
        for (let a = 0; a < iClass.classStudents.length; a++) {
            for (b = 0; b < req.body.classStudents.length; b++)
                if (iClass.classStudents[a]._id == req.body.classStudents[b]._id)
                    break;

            if (b == req.body.classStudents.length) {
                let tempPoints = [];
                let count = 0;
                let userPoints = await userCollection.findOne({ _id: iClass.classStudents[a]._id });
                for (let c = 0; c < userPoints.classPoints.length; c++)
                    if (userPoints.classPoints[c].id != iClass._id) {
                        tempPoints[count] = userPoints.classPoints[c];
                        count++;
                    }
                userPoints.classPoints = tempPoints;
                pointsRefresh(userPoints);
                await userCollection.updateOne({ _id: userPoints._id }, { $set: { classPoints: tempPoints } });
            }
        }

        let exist = false;
        let j = 0;
        let studnetArr = [];
        for (let i = 0; i < req.body.classStudents.length; i++) {
            exist = false;
            for (j; j < iClass.classStudents.length; j++) {
                if (req.body.classStudents[i]._id == iClass.classStudents[j]._id) {
                    exist = true;
                    break;
                }
            }
            if (exist) {
                let tempSub = {};
                let subArr = [];
                for (let a = 0; a < req.body.classSubject.length; a++) {
                    tempSub.subName = req.body.classSubject[a].name;
                    tempSub.points = 0;

                    for (let b = 0; b < iClass.classStudents[j].subPoints.length; b++)
                        if (iClass.classStudents[j].subPoints[b].subName == tempSub.subName)
                            tempSub.points = iClass.classStudents[j].subPoints[b].points;

                    subArr[a] = {};
                    subArr[a].subName = tempSub.subName;
                    subArr[a].points = tempSub.points;
                }
                iClass.classStudents[j].subPoints = subArr;
                studnetArr[i] = {};
                studnetArr[i] = iClass.classStudents[j];
            }
            else {
                let user = await userCollection.findOne({ _id: req.body.classStudents[i]._id });
                let tempUser = {};
                let cpLen = user.classPoints.length;
                user.classPoints[cpLen] = {};
                user.classPoints[cpLen].id = iClass._id;
                user.classPoints[cpLen].points = 0;
                await userCollection.updateOne({ _id: user._id }, { $set: { classPoints: user.classPoints } })

                tempUser._id = user._id;
                tempUser.firstName = user.firstName;
                tempUser.lastName = user.lastName;
                tempUser.nickName = user.nickName;
                tempUser.classPoints = 0;

                tempUser.subPoints = [];
                for (let c = 0; c < req.body.classSubject.length; c++) {
                    tempUser.subPoints[c] = {};
                    tempUser.subPoints[c].subName = req.body.classSubject[c].name;
                    tempUser.subPoints[c].points = 0;
                }
                studnetArr[i] = {};
                studnetArr[i] = tempUser;
            }
        }
        await classCollection.updateOne({ _id: iClass._id }, { $set: { classStudents: studnetArr } });
    }
    catch (err) {
        console.log(err);
        res.status(400).send();
    }
    res.status(200).send();
});

classPut.patch("/api/updatePoints/:id", auth, async (req, res) => {
    try {
        await classCollection.updateOne({ _id: req.body._id }, { $set: { classSubject: req.body.classSubject } });
        await classCollection.updateOne({ _id: req.body._id }, { $set: { classStudents: req.body.classStudents } });

        for (let i = 0; i < req.body.classStudents.length; i++) {
            let user = await userCollection.findOne({ _id: req.body.classStudents[i]._id });
            for (let j = 0; j < user.classPoints.length; j++)
                if (req.body._id == user.classPoints[j].id) {
                    user.classPoints[j].points = req.body.classStudents[i].classPoints;
                    await userCollection.updateOne({ _id: user._id }, { $set: { classPoints: user.classPoints } });
                    break;
                }
            pointsRefresh(user);
        }
    }
    catch (err) {
        console.log(err)
        res.status(400).send();
    }
    res.status(200).send();
})

async function pointsRefresh(user) {
    user.totalPoints.level = 1;
    user.totalPoints.xp = 0;
    for (let x = 0; x < user.classPoints.length; x++)
        user.totalPoints.xp += user.classPoints[x].points;

    while (user.totalPoints.xp >= 1000) {
        user.totalPoints.xp -= 1000;
        user.totalPoints.level += 1;
    }
    await userCollection.updateOne({ _id: user._id }, { $set: { totalPoints: user.totalPoints } });
}

module.exports = classPut;