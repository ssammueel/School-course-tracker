const jwt = require("jsonwebtoken");

function checkToken(req,res,next){
    if(req.headers.authorization !== undefined)
    {
        let token = req.headers.authorization.split(" ")[1]
        jwt.verify(token, "studentApp",(err,data)=>{
            if(!err){
                next()
            }
            else{
                res.send("invalod tokens")
            }
        })

    }
    else
    {
        res.send("token not found")
    }
   
}
module.exports = checkToken;