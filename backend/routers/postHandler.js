
const express = require("express");
const mongoose = require("mongoose");
const post = require('../models/post.js');
const user = require('../models/userInfo.js');
const thread = require('../models/thread.js');
const vote = require('../models/vote.js');
const comment = require('../models/comment.js');
const router = express.Router();

router.post('/create',async (req,res)=> {
    const {username, title,body,thread_name} = req.body;
    
    const User = await user.findOne({username:username});
    if(!User){
        res.status(400).json("Could not find user");
    }
    else{
        const Thread = await thread.findOne({threadname:thread_name});
        if(!Thread){
            res.status(400).json("Could not find thread");
        }
        else{
            //insert post to database
            const Post= await post.create({author:User._id,title:title,body:body,thread: Thread._id});
            if(Post){
                await thread.updateOne({"_id": Thread._id},{$push:{"posts": Post._id}});
                await user.updateOne({"_id": User._id},{$push:{"posts": Post._id}})
                res.json(Post);
            }
            else{
                res.status(400).json("Post creation failed");
            }
        }
    }
});

router.get('/find', async (req,res)=> {
    const {post_id} = req.query;
    //find post in database
    var post_objectId = mongoose.Types.ObjectId(post_id);
    const Post = await post.findById(post_objectId);
    if(Post){
        res.json(Post);
    }
    else{
        res.status(400).json("Post could not be found");
    }
    
});

router.post('/remove',async (req,res)=> {
    const {post_id} = req.body;
    var post_objectId = mongoose.Types.ObjectId(post_id);
    const Post = await post.findById(post_objectId);

    if(!Post){
        res.status(400).json("Could not find post to delete");
    }
    else{
        const User = await user.findOne({_id:Post.author});
        const Thread = await thread.findOne({_id:Post.thread});
        if(!Thread){
            res.status(400).json("Could not find thread for post to delete");
        }
        else if(!User){
            res.status(400).json("Could not find user for post to delete");
        }
        else{
            //delete post from database
            votecount = Post.votes.length;
            commentcount = Post.comments.length;
            votesdeleted = 0;
            commentsdeleted = 0;
            for(const t of Post.votes){
                votestatus = await vote.deleteOne({_id:t});
                votesdeleted += votestatus.deletedCount;
            }
            for(const t  of Post.comments){
                Comment = await comment.findOne({"_id": t});
                for(const n of Comment.votes){
                    await vote.deleteOne({_id:n});
                }
                await user.updateOne({"_id": User._id},{$pull:{"comments": t}});
                commentstatus = await comment.deleteOne({_id:t});
                commentsdeleted += commentstatus.deletedCount;
            }
            await thread.updateOne({"_id": Thread._id},{$pull:{"posts": Post._id}});
            await user.updateOne({"_id": User._id},{$pull: {"posts": Post._id}});
            const status= await post.deleteOne({_id:Post._id});
            if(status.deletedCount ==1 && votesdeleted == votecount && commentsdeleted == commentcount ){
                res.status(200).json("Post succesfully deleted");
            }
            else{
                res.status(400).json("Post deletion failed");
            }
        }
    }
});

module.exports = router;