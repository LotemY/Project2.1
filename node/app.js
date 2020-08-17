const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const user = require('../http/Post');

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

let userCollection = db.collection("user");



let port = process.env.PORT || 3600;
app.listen(port, () => console.log("Server Is OK"));

app.post("/Home", (req, res) => {
    let newUser = new user({
        userName: req.body.userName,
        password: req.body.password
    });

    userCollection.insert(newUser,function(err,res){
        console.log(res);
        if(err) return console.log(err);   
    })

    res.status(201);
    res.send({ "msg": "success" });
})
