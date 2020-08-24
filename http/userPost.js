
const userSchema = require('../Schemas/Post');
let userCollection = db.collection("user");
const router=express.Router();

router.post("/signUp", (req, res) => {
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

module.exports = router;
