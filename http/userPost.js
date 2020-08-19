const appJS=require('../node/app')

let userCollection = appJS.db.collection("user");
appJS.post("/Home", (req, res) => {
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