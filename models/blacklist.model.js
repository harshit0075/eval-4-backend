const mongoose=require("mongoose")

const blacklistSchema=new mongoose.Schema({
    blaclist: {type:[String]},
})

const blacklistModel=mongoose.model("blacklist", blacklistSchema)

module.exports=blacklistModel