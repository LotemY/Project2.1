const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.static('./dist/Angular'));


mongoose.connect(
    'mongodb://127.0.0.1:27017/project',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

let db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
    console.log("Connection Successful!");
});

let port = process.env.PORT || 3600;
app.listen(port, () => console.log("Server Is OK"));

const userSchema = require('../Schemas/Post');
let userCollection = db.collection("user");

app.post("/signUp", (req, res) => {
    let newUser = new userSchema({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });
    if (req.body.nickName) {
        newUser.nickName = req.body.nickName
    }
    userCollection.insert(newUser, function (err, res) {
        console.log(res);
        if (err) return console.log(err);
    })

    res.status(201);
    res.send({ "msg": "success" });
    
})