const express=require("express")
const {connection}=require("./config/db")
const {userRouter}=require("./routes/user.route")

const {auth}=require("./middlewares/auth.middleware")
const cors=require("cors")
const { instaRouter } = require("./routes/insta.route")
require("dotenv").config()
const app=express()
app.use(cors())

app.use(express.json())
app.use("/users", userRouter)
app.use("/insta",auth,instaRouter)


app.get("/",(req,res)=>{
res.send("Home Page")
})



app.listen(1001,async()=>{
    try {
        await connection
        console.log("connected to db");
        console.log('server is running at port 1001')
    } catch (error) {
        console.log(error.message);
    }

})