const mongoose = require('mongoose');
require('../../../DAL/mongoose');
const express = require('express');
const classD = express.Router();
require('dotenv').config();
const auth = require('../auth');

let classCollection = mongoose.connection.collection("class");
let userCollection = mongoose.connection.collection("user");

classD.delete("/api/teacherHP/:id/tClass/:cId/edit", auth, async (req, res) => {
    let delClass = await classCollection.findOne({ _id: req.params.cId });
    for (let i = 0; i < delClass.classStudents.length; i++) {
        let user = await userCollection.findOne({ _id: delClass.classStudents[i]._id });
        let tempPoints = [];
        let count = 0;
        for (let c = 0; c < user.classPoints.length; c++)
            if (user.classPoints[c].id != delClass._id) {
                tempPoints[count] = user.classPoints[c];
                count++;
            }
            else 
                user.classPoints[0].points += user.classPoints[c].points;
            
        await userCollection.updateOne({ _id: user._id }, { $set: { classPoints: tempPoints } });
    }

    await classCollection.deleteOne({ _id: delClass._id }, async (err, res) => {
        if (err) return res.status(500).send();
    });
    res.status(200).send();
});

module.exports = classD;