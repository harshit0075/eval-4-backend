const jwt=require("jsonwebtoken")
require("dotenv").config()

const {BlacklistModel}=require("../models/blacklist.model")

const auth=async(req,res,next)=>{
    const token=req.headers.authorization.split(" ")[1]
    try {
        let newToken=await BlacklistModel.find({
            blacklist:{$in:token},
        })
        if(newToken){
            res.status(200).json("Please login......!")
        }else{
            const decoded=jwt.verify(token, process.env.SECRET)
            req.body.userID=decoded.userID
            next()
        }
    } catch (err) {
        res.status(400).json({err:err.message})
    }
}

module.exports={
    auth
}