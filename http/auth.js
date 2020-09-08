const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        let token = req.header("token")
        console.log(token);

        if (!token)
            return res.status(401).send("Access Denied");

        const verified = jwt.verify(token, process.env.SECRET_TOKEN);
        req.user = verified;
        next();
    } catch (err) {
        console.log(err);
        res.status(400).send("Invalid Token");
    }
}