const mongoose = require('mongoose');
require('../../../DAL/mongoose');
const express = require('express');
const classG = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../auth');

let userCollection = mongoose.connection.collection("user");
let classCollection = mongoose.connection.collection("class");

classG.get('/api/user/:id/classes', auth, async (req, res) => {
    let classes;
    try {
        let id = jwt.verify(req.header("token"), process.env.SECRET_TOKEN)._id;
        let user = await userCollection.findOne({ _id: id });
        if (user.nickName) {
            classes = await classCollection.find(({}, { classStudents: { $elemMatch: { _id: { $eq: user._id } } } })).toArray();
        }
        else
            classes = await classCollection.find({ classTeacher: user._id }).toArray();
    }
    catch (err) {
        console.log(err);
    }
    res.send(classes);
});


classG.get(`/api/user/:id/class/:cId`, auth, async (req, res) => {
    try {
        let iClass = await classCollection.findOne({ _id: req.params.cId });
        if (req.params.id == iClass.classTeacher)
            res.send(iClass);

        else if (req.params.id != iClass.classTeacher) {
            for (let i = 0; i < iClass.classStudents.length; i++)
                if (req.params.id == iClass.classStudents[i]._id)
                    return res.send(iClass);
        }
        else
            res.status(401).send("Error");
    }
    catch (err) {
        return res.status(401).send();
    }
});

module.exports = classG;