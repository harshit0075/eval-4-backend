const mongoose=require("mongoose");

const instaSchema=mongoose.Schema({
title: String,
body: String,
device: String,
no_of_comments: Number
})

const InstaModel=mongoose.model("insta", instaSchema)

module.exports={
    InstaModel
}