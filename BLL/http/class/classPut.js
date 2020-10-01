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

        if (iClass.grade != req.body.grade)
            await classCollection.updateOne({ _id: iClass._id }, { $set: { grade: req.body.grade } });
        if (iClass.className != req.body.className)
            await classCollection.updateOne({ _id: iClass._id }, { $set: { className: req.body.className } });
        await classCollection.updateOne({ _id: iClass._id }, { $set: { classSubject: req.body.classSubject } });

        let reqCounter = 0;
        for (let i = 0; i < req.body.classStudents.length; i++) {
            let user = await userCollection.findOne({ _id: req.body.classStudents[i]._id })
            if (user) {
                user.email = undefined;
                user.password = undefined;
                user.token = undefined;
                user.points = [];
                
                // במקרה שנושא נמחק, למחוק את האיבר במערך
                // במקרה של הוספת תלמיד חדש או נושא חדש לאתחל את הנקודות 
                
                iClass.classStudents[reqCounter] = user;
                reqCounter++;
            }
        }
        await classCollection.updateOne({ _id: iClass._id }, { $set: { classStudents: iClass.classStudents } });
    }
    catch (err) {
        console.log(err)
        res.status().send();
    }
    res.status(200).send();
});

module.exports = classPut;