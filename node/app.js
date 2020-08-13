const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.connect('mongodb://127.0.0.1:27017/project',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () =>
        console.log('DB is connected'));

app.use(bodyParser.json());
app.use(express.static('./dist/Angular'));

let port = process.env.PORT || 3500;
app.listen(port, () => console.log("Server Is OK"));

const Post = require('../http/Post');
const { response } = require('express');

app.post('/', (req, res) => {
    console.log(req.body);
    res.status(201);
    res.send({"msg":"success"});
})