const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.static('./dist/Angular'));
const userP = require('../http/user/userPost');
const userG = require('../http/user/userGet');
const jwt = require('jsonwebtoken');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

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

app.use(userP);
app.use(userG)