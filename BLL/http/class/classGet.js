const mongoose = require('mongoose');
require('../../../DAL/mongoose');
const express = require('express');
const classG = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../auth');

let userCollection = mongoose.connection.collection("user");
let classCollection = mongoose.connection.collection("class");

classG.get('/api/classes', auth, async (req, res) => {
    let classes;
    try {
        let id = jwt.verify(req.header("token"), process.env.SECRET_TOKEN)._id;
        let user = await userCollection.findOne({ _id: id });

        if (user.nickName) {
            classes = await classCollection.find({ classStudents: user._id }).toArray();
        }
        else {
            classes = await classCollection.find({ classTeacher: user._id }).toArray();
        }
    }
    catch (err) {
        console.log(err);
    }
    res.send(classes);
});


classG.get(`/api/class/:cId`, auth, async (req, res) => {
    let iClass = await classCollection.findOne({ _id: req.params.cId });
    res.send(iClass);
});


module.exports = classG;

