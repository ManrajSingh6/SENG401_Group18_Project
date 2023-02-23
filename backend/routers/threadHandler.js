const express = require("express");
const router = express.Router();

const thread = require('../models/thread.js');
const user= require('../models/userInfo.js');
const vote = require('../models/vote.js');
const comment = require('../models/comment.js');
const post = require('../models/post.js');
const bodyParser = require('body-parser');



router.post('/create', async (req,res)=> {
    const {thread_name, thread_description,username} = req.body;
    const User = await user.findOne({username:username});
    if(!User){
        res.status(400).send('User not found to create thread');
    }
    else{
        //insert thread into database
        if(await thread.findOne({threadname:thread_name}).exec()){
            res.status(400).json("Thread name is already taken");
        }
        else{
            const Thread = await thread.create({threadname:thread_name,description:thread_description,userCreated:User._id });
            if(Thread){
                res.json(Thread);
            }
            else{
                res.status(400).json("Thread creation failed");
            }
        }
    }
});

router.get('/find',async (req,res)=> {
    const {thread_name} = req.query;
    //find thread in database
    
    const Thread = await thread.findOne({threadname:thread_name});
    if(Thread){
        res.send(Thread._id.toString());
    }
    else{
        res.status(400).send('Thread not found');
    }
    
});

router.post('/subscribe', async (req,res)=>{
    const{thread_name,username} = req.body;
    const Thread = await thread.findOne({threadname:thread_name});
    if(!Thread){
        res.status(400).send('Thread not found');
    }
    else{
        const User = await user.findOne({username:username});
        if(!User){
            res.status(400).send('User not found');
        }
        else{
            await user.updateOne({"_id": User._id},{$push:{"subscribed": Thread._id}});
            res.json(User);
        }
    }
});
router.post('/remove',async (req,res)=>{
    const {thread_name} = req.body;

    const Thread = await thread.findOne({threadname:thread_name});
    if(!Thread){
        res.status(400).json("could not find thread to delete");
    }
    else{
        postcount = Thread.posts.length;
        postsdeleted = 0;
        for(const i of Thread.posts){
            Post = await post.findOne({"_id": i});
            for(const j of Post.votes){
                await vote.deleteOne({_id:j});
            }
            for(const j of Post.comments){
                Comment = await comment.findOne({"_id": j});
                for(const n of Comment.votes){
                    await vote.deleteOne({_id:n});
                }
                await user.updateOne({"_id":Comment.author},{$pull:{"comments": Comment}});
                await comment.deleteOne({_id:j});
            }   
            await user.updateOne({"_id":Post.author},{$pull:{"posts": Post}});
            poststatus = await post.deleteOne({_id:i});
            postsdeleted += poststatus.deletedCount;
        }

        const status = await thread.deleteOne({"_id": Thread._id});
        if(status.deletedCount ==1 && postsdeleted == postcount ){
            res.status(200).json("Thread succesfully deleted");
        }
        else{
            res.status(400).json("Thread deletion failed");
        }
    }
});
module.exports = router;