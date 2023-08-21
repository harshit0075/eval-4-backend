const {Router}=require("express")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const {UserModel}=require("../models/user.model")
const {BlacklistModel}=require("../models/blacklist.model")


require("dotenv").config()
const userRouter=Router()

userRouter.post("/register", async (req, res) => {
    // const { name, email, pass } = req.body
    
    try {
        const email=req.body.email;
        const pass=req.body.pass;
        const user=await UserModel.findOne({email})
        if(user){
            res.status(400).json({msg:"User Already registered...!"})
        }else{

            bcrypt.hash(pass, 10, async (err, hash) => {
                if(hash){
                    const newUser= new UserModel({
                        ...req.body,
                        pass:hash,
                    })
                    await newUser.save();
                    res.status(200).json({msg:"User Registration Sucessfull.....!"})
                }
                
            })
        }
        
    } catch (err) {
        res.json({ error: err.message })
    }
})


userRouter.post("/login", async (req, res) => {
    const { email, pass } = req.body
    try {
        const user = await UserModel.findOne({ email })
        if (user) {
   bcrypt.compare(pass, user.pass, (err, result) => {
    if (result) {
    let token = jwt.sign({ userID: user._id, user: user.name }, "masai")
    res.json({ msg: "Logged in !!", "token":token })
     } else {
     res.send({ "error":"Wrong Creadential...." })
    }
     })
        } 
        
    } catch (error) {
        res.send({ "error": err})
    }
})



userRouter.get("/logout",async(req,res)=>{
    try {
        const token=req.headers.authorization?.split(" ")[1]||null;
        if(token){
            await BlacklistModel.updateMany({}, { $push: {blacklist:[token]}})
            res.status(200).send("Logout sucessfull....!")
        }
    } catch (err) {
        res.status(400).send({error:err.message})
    }
})





module.exports={
    userRouter
}
