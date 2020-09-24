const e = require('express');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        let token = req.header("token")

        if (!token)
            return res.status(401).send("Access Denied");

        const verified = jwt.verify(token, process.env.SECRET_TOKEN);
        req.user = verified;
        const id = jwt.verify(token, process.env.SECRET_TOKEN)._id;
        if (id == req.params.id)
            next();
        else
            res.status(401).send("Invalid User");

    } catch (err) {
        res.status(401).send("Invalid Token");
    }
}