const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.static('../Angular/dist/Angular'));
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const userP = require('../http/user/userPost');
const userG = require('../http/user/userGet');
const userPut = require('../http/user/userPut');
const userD = require('../http/user/userDelete');

const classP = require('../http/class/classPost');
//const classG = require('../http/class/classGet');
//const classPut = require('../http/class/classPut');
//const classD = require('../http/class/classDelete');

mongoose.connect(
    process.env.MONGO,
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

app.use(userP);
app.use(userG);
app.use(userPut);
app.use(userD);

app.use(classP);
//app.use(classG)
//app.use(classPut);
//app.use(classD);


