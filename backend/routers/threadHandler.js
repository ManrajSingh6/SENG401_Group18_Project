const express = require("express");
const router = express.Router();

const thread = require('../models/thread.js');
const user= require('../models/userInfo.js');
const vote = require('../models/vote.js');
const comment = require('../models/comment.js');
const post = require('../models/post.js');
const bodyParser = require('body-parser');

const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});
const filesystem = require('fs');

router.post('/create', uploadMiddleware.single('threadFile'), async (req,res)=> {
    const {thread_name, thread_description, username} = req.body;
    
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const extension = parts[parts.length - 1];
    const newPath = path + '.' + extension;
    filesystem.renameSync(path, newPath);
    
    console.log("Threadname: " + thread_name);
    console.log("Threaddesc: " + thread_description);
    console.log("Thread Creator: " + username);
    console.log("orginalname: " + originalname);
    console.log("path: " + path);
    console.log("newPath: " + newPath);
    
    const userDoc = await user.findOne({username:username});
    if(!userDoc){
        res.status(400).send('User not found to create thread');
    }
    else{
        //insert thread into database
        if(await thread.findOne({threadname:thread_name}).exec()){
            res.status(400).json("Thread name is already taken");
        }
        else{
            const Thread = await thread.create({threadname:thread_name, description:thread_description, userCreated: userDoc._id, threadImgUrl: newPath});
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
        res.send(Thread);
    }
    else{
        res.status(400).send('Thread not found');
    }
    
});

router.get("/allpostsbythread", async (req, res) => {
    const {thread_name} = req.query;
    const Thread = await thread.findOne({threadname: thread_name});
    
    if (Thread){
        const threadPosts = Thread.posts;
        var postData = [];
        const parentThreadInfo = {parentThreadName: Thread.threadname, dateCreated: Thread.dateCreated, userCreated: Thread.userCreated, description: Thread.description};
        postData.push(parentThreadInfo);
        for (let i = 0; i < threadPosts.length; i++){
            const postDoc = await post.findById(threadPosts[i]);
            if (postDoc){
                postData.push(postDoc);
            }
        }
        res.send(postData);
    } else {
        res.status(400).send("Could not find thread with threadname: " + thread_name);
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
        for(i of Thread.posts){
            Post = await post.findOne({"_id": i});
            for(const j of Post.votes){
                await vote.deleteOne({"_id":j});
            }
            for(k of Post.comments){
                Comment = await comment.findOne({"_id": k});
                for(n of Comment.votes){
                    await vote.deleteOne({"_id":n});
                }
                await user.updateOne({"_id":Comment.author},{$pull:{"comments": k}});
                await comment.deleteOne({"_id":k});
            }   
            await user.updateOne({"_id":Post.author},{$pull:{"posts": i}});
            poststatus = await post.deleteOne({"_id":i});
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

router.get("/allthreadnames", async (req, res) => {
    res.json(
        await thread.find({}, {threadname:1})
    )
});

router.get("/getallthreads", async (req, res) => {
    res.json(
        await thread.find({}, {})
    )
});

router.get("/getpostids", async (req, res) => {

});



module.exports = router;