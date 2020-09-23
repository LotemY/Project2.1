const mongoose = require('mongoose');
const express = require('express');
const userD = express.Router();
require('../../../DAL/mongoose');
require('dotenv').config();
const auth = require('../auth');

let userCollection = mongoose.connection.collection("user");
let classCollection = mongoose.connection.collection("class");

userD.delete(`/api/user/:id/delete`, auth, async (req, res) => {
    let user = await userCollection.findOne({ _id: req.params.id });

    await userCollection.deleteOne({ _id: user._id }, async (err, res) => {
        if (err) return res.status(500).send();
    });

    if (user.nickName) {
        await classCollection.updateMany({}, { $pull: { classStudents: user._id } });
    }
    else
        await classCollection.deleteMany({ classTeacher: user._id });

    res.status(200).send();
})


module.exports = userD;