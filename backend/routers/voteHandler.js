const express = require("express");
const mongoose = require("mongoose");
const vote = require('../models/vote.js');
const comment = require('../models/comment.js');
const user = require('../models/userInfo.js');
const post = require('../models/post.js');
const router = express.Router();

router.post('/comment',async (req,res)=> {
    const {username,commentID} = req.body;

    var comment_objectId = mongoose.Types.ObjectId(commentID);
    const Comment = await comment.findById(comment_objectId);
    const User = await user.findOne({username:username});
    if(!Comment){
        res.status(400).json("Could not find comment to like");
    }
    else if(!User){
        res.status(400).json("Could not find user to like comment");
    }
    else{
    //insert vote for comment to database
        if(await vote.findOne({username: User._id,commentId: Comment._id})){//no duplicate like
            res.status(400).json("Cannot Like the same comment again");
        } 
        else{
        const Vote = await vote.create({username: User._id,commentId: Comment._id});
            if(Vote){
                await comment.updateOne({"_id": Comment._id},{$push:{"votes": Vote._id}});
                res.json(Vote);
            }
            else{
                res.status(400).json("Vote creation failed");
            }
        }
    }
    
});
router.post('/post',async (req,res)=> {
    const {username,postID} = req.body;


    var post_objectId = mongoose.Types.ObjectId(postID);
    const Post = await post.findById(post_objectId);
    const User = await user.findOne({username:username});


   if(!Post){
        res.status(400).json("Could not find post to like");
    }
    else if(!User){
        res.status(400).json("Could not find user to like post");
    }
    else{
    //insert vote for post to database
        if(await vote.findOne({username: User._id,postId: Post._id})){//no duplicate like
            res.status(400).json("Cannot Like the same post again");
        } 
        else{
            const Vote = await vote.create({username: User._id,postId: Post._id});
            if(Vote){
                await post.updateOne({"_id": Post._id},{$push:{"votes": Vote._id}});
                res.json(Vote);
            }
            else{
                res.status(400).json("Vote creation failed");
            }
        }
    }
    
});
router.post('/comment/remove',async (req,res)=> {
    const {username,commentID} = req.body;
    const userDoc = await user.findOne({username: username});
    const Vote= await vote.findOne({username: userDoc._id, commentId: commentID});
    if(!Vote){
        res.status(400).json("Could not find vote to delete");
    }
    else{
        const Comment = await comment.findOne({_id:Vote.commentId});
        if(!Comment){
        res.status(400).json("Could not find comment with vote to delete");
        }
        else{
        //remove vote for comment from database
            await comment.updateOne({"_id": Comment._id},{$pull:{"votes": Vote._id}});
            const status= await vote.deleteOne({_id:Vote._id});
            if(status.deletedCount ==1){
                res.status(200).json("Vote succesfully deleted");
            }
            else{
                res.status(400).json("Vote deletion failed");
            }
        }
    }
    
});
router.post('/post/remove',async (req,res)=> {
    const {username, postID} = req.body;
    const userDoc = await user.findOne({username: username});
    var post_objectID = mongoose.Types.ObjectId(postID);
    const Vote= await vote.findOne({username: userDoc._id, postId: post_objectID});
    if(!Vote){
        res.status(400).json("Could not find vote to delete");
    }
    else{
        const Post = await post.findOne({_id:Vote.postId});
    
         if(!Post){
            res.status(400).json("Could not find post with vote to delete");
        }
        else{
        //remove vote for comment from database
            await post.updateOne({"_id": Post._id},{$pull:{"votes": Vote._id}});
            const status= await vote.deleteOne({_id:Vote._id});
            if(status.deletedCount ==1){
                res.status(200).json("Vote succesfully deleted");
            }
            else{
                res.status(400).json("Vote deletion failed");
            }   
        }
    }
    
});




module.exports = router;