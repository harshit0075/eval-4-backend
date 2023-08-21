const {Router}=require("express")
const {InstaModel}=require("../models/insta.model")

const instaRouter=Router()


instaRouter.get("/",async(req,res)=>{
const {pageNo, limit, minComments,maxComments, device1, device2}=req.query;
const skip=(pageNo - 1) * limit;
const {userID}=req.body;
const query={};
if(userID){
    query.userID=userID
}
if(minComments && maxComments){
    query.no_of_comments={
        send:[
            {no_of_comments: {$gt:minComments}},
            {no_of_comments: {$lt:maxComments}},
        ]
    }
}
if(device1 && device2){
    query.device={$and: [{device:device1}, {device: device2}]}
}else if(device1){
    query.device=device1
}else if(device2){
    query.device=device2
}
try {
    const posts=await InstaModel.finf(query)
    .sort({no_of_comments:1})
    .skip(skip)
    .limit(limit)
    res.status(200).json({msg:"user posts",posts})
} catch (error) {
    res.status(400).json({error:error.message})
}
})



instaRouter.get("/top",async(req,res)=>{
    const {pageNo}=req.query;
    const limit=3;
    const skip=(pageNo - 1) *limit
    try {
        const topposts=await InstaModel.finf()
        .sort({no_of_comments: -1})
        .skip(skip)
        .limit(limit)
        res.status(200).json({msg:"user posts",topposts})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
    })


    instaRouter.post ("/add",async(req,res)=>{
        const {userID}=req.body;
        try {
            const post=new InstaModel({...req.body,userID});
            await   post.save();
            res.status(200).json({msg:"post was added"})
        } catch (error) {
            res.status(400).json({error:error.message})
        }
    })

    instaRouter.patch("/update/:postID",async(req,res)=>{
        const {postID}=req.params;
        const {userID}=req.body;

        try {
            const post =await InstaModel.findIdAndUpdate({
                userID, _id:postID },
                req.body
                );
                if(!post){
                    res.status(400).json({msg:"post not found"});
                }else{
                    res.status(200).json({msg:"post updated"})
                }
        } catch (error) {
            res.status(400).json({msg:error.message})
        }
    })

    instaRouter.delete("/delete/:postID",async(req,res)=>{
        const {postID}=req.params;
        const {userID}=req.body;

        try {
            const post =await InstaModel.findIdAndDelete({
                userID, _id:postID });
                if(!post){
                    res.status(400).json({msg:"post not found"});
                }else{
                    res.status(200).json({msg:"post updated"})
                }
        } catch (error) {
            res.status(400).json({msg:error.message})
        }
    })



module.exports={
    instaRouter
}