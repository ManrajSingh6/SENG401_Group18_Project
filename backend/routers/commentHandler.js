
const express = require("express");
const mongoose = require("mongoose");
const post = require('../models/post.js');
const user = require('../models/userInfo.js');
const comment = require('../models/comment.js');
const vote = require("../models/vote.js");
const router = express.Router();

router.post('/create',async (req,res)=> {
    const {username,body,post_id} = req.body;
    
    const User = await user.findOne({username:username});
    var post_objectId = mongoose.Types.ObjectId(post_id);
    const Post = await post.findById(post_objectId);
    if(!User){
        res.status(400).json("Could not find user");
    }
    else if(!Post){
        res.status(400).json("Could not find post");
    }
    else{
    //insert comment to database
    const Comment= await comment.create({author:User._id,body:body,postId: Post._id});
        if(Comment){
            await post.updateOne({"_id": Post._id},{$push:{"comments": Comment._id}});
            await user.updateOne({"_id": User._id},{$push: {"comments": Comment._id}});
            res.json(Comment);
        }
        else{
            res.status(400).json("Comment creation failed");
        }
    }
    
});
router.get('/find', async (req,res)=> {
    const {comment_id} = req.query;
    //find comment in database
    var comment_objectId = mongoose.Types.ObjectId(comment_id);
    const Comment = await comment.findById(comment_objectId);
    if(Comment){
        res.json(Comment);
    }
    else{
        res.status(400).json("Comment could not be found");
    }
    
});
router.post('/remove',async (req,res)=> {
    const {comment_id} = req.body;

    var comment_objectId = mongoose.Types.ObjectId(comment_id);
    const Comment = await comment.findOne({comment_objectId});
    if(!Comment){
        res.status(400).json("Could not find comment to delete");
    }
    else{
        const Post = await post.findOne({_id: Comment.postId});
        const User = await user.findOne({_id: Comment.author}) ;
        if(!Post){
        res.status(400).json("Could not find post with comment to delete");
        }   
        else if(!User){
        res.status(400).json("Could not find user with comment to delete");
        }
        else{
        //remove vote for comment from database
            await post.updateOne({"_id": Post._id},{$pull:{"comments": Comment._id}});
            await user.updateOne({"_id": User._id},{$pull:{"comments": Comment._id}});
            count = Comment.votes.length;
            votesdeleted = 0;
            for(const t of Comment.votes){
                votestatus = await vote.deleteOne({_id:t});
                votesdeleted += votestatus.deletedCount;
            }
                const status= await comment.deleteOne({_id:Comment._id});
                if(status.deletedCount ==1 && votesdeleted==count){
                    res.status(200).json("Comment succesfully deleted");
                }
                else{
                    res.status(400).json("Comment deletion failed");
                }
            
        }
    }
});

module.exports = router;