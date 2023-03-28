const express = require("express");
const router = express.Router();

const thread = require('../models/thread.js');
const user= require('../models/userInfo.js');
const vote = require('../models/vote.js');
const comment = require('../models/comment.js');
const post = require('../models/post.js');
const notification = require('../models/notification.js');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const multer = require('multer');
const filesystem = require('fs');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../configs/.env')});

// Email notification settings
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "seng401project@gmail.com",
        pass: "wpqwjjhdkflewoqb"
    },
    tls: {
        rejectUnauthorized: false,
    }
});

// AWS S3 Client
const {S3Client, PutObjectCommand,DeleteObjectCommand} = require('@aws-sdk/client-s3');

async function uploadToS3(path, originalFileName, mimetype){
    const client = new S3Client({
        region: 'us-east-2',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        },
    });

    const parts = originalFileName.split('.');
    const ext = parts[parts.length - 1];
    const newFileName = Date.now() + '.' + ext;
    await client.send(new PutObjectCommand({
        Bucket: 'seng401project',
        Body: filesystem.readFileSync(path),
        Key: newFileName,
        ContentType: mimetype,
        ACL: 'public-read'
    }));

    return (`https://seng401project.s3.amazonaws.com/${newFileName}`);
}

const uploadMiddleware = multer({dest: '/tmp'});
router.post('/create', uploadMiddleware.single('threadFile'), async (req,res)=> {
    mongoose.connect(process.env.MONGO_URL);
    const {thread_name, thread_description, username} = req.body;
    if(!req.file){
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
                const currentDateTime = new Date();
                const Thread = await thread.create({threadname:thread_name, description:thread_description, userCreated: userDoc._id, dateCreated: currentDateTime});
                if(Thread){
                    res.json(Thread);
                }
                else{
                    res.status(400).json("Thread creation failed");
                }
            }
        }
    }
    else{
    const {originalname, path, mimetype} = req.file;
    
    
    // const parts = originalname.split('.');
    // const extension = parts[parts.length - 1];
    // const newPath = path + '.' + extension;
    // filesystem.renameSync(path, newPath);

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
         
            const imageURL = await uploadToS3(path, originalname, mimetype);
            const currentDateTime = new Date();
                const Thread = await thread.create({threadname:thread_name, description:thread_description, userCreated: userDoc._id, threadImgUrl: imageURL, dateCreated: currentDateTime});
            if(Thread){
                res.json(Thread);
            }
            else{
                res.status(400).json("Thread creation failed");
            }
    }
    }
}
});
router.get('/find',async (req,res)=> {
    mongoose.connect(process.env.MONGO_URL);

    const {thread_name} = req.query;
    //find thread in database
    const Thread = await thread.findOne({threadname:thread_name});
    if(Thread){
        res.json(Thread);
    }
    else{
        res.status(400).send('Thread not found');
    }
    
});

router.get("/allpostsbythread", async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    const {thread_name} = req.query;
    const Thread = await thread.findOne({threadname: thread_name}).populate('userCreated', 'username');
    
    if (Thread){
        const threadPosts = Thread.posts;
        var postData = [];
        const parentThreadInfo = {parentThreadName: Thread.threadname, dateCreated: Thread.dateCreated, userCreated: Thread.userCreated.username, description: Thread.description};
        postData.push(parentThreadInfo);
        for (let i = 0; i < threadPosts.length; i++){
            const postDoc = await post.findById(threadPosts[i]).populate('author', 'username');
            if (postDoc){
                postData.push(postDoc);
            }
        }
        res.send(postData);
    } else {
        res.status(400).send("Could not find thread with threadname: " + thread_name);
    }
});

async function sendEmailToThreadCreator(threadCreatorAddress, subscriberUsername, threadName){
    let mailOptions = {
        from: "seng401project@gmail.com",
        to: threadCreatorAddress,
        subject: `Thread: ${threadName} recieved a new subscriber!`,
        text: `A new user (${subscriberUsername}) has subscribed to your thread (${threadName}).`
    };
    
    transporter.sendMail(mailOptions, function(err, success) {
        if (err) {
            console.log(err);
        } else {
            console.log("Email sent successfully");
        }
    });
}

router.post('/subscribe', async (req,res)=>{
    mongoose.connect(process.env.MONGO_URL);

    const{thread_name,username} = req.body;
    const Thread = await thread.findOne({threadname:thread_name}).populate('userCreated', 'email');
    if(!Thread){
        res.status(400).send('Thread not found');
    }
    else{
        const User = await user.findOne({username:username});
        if(!User){
            res.status(400).send('User not found');
        }
        else{
            const isAlreadySubbed = User.subscribed.includes(Thread._id);
            if (isAlreadySubbed){
                res.status(400).json("User is already subscribed to thread!");
            } else {
                await user.updateOne({"_id": User._id},{$push:{"subscribed": Thread._id}});
                await thread.updateOne({"_id": Thread._id}, {$push: {"allSubscribers": User._id}});

                // Updating notification for thread creator
                const currentDateTime = new Date();
                const notiMessage = `A user (${username}) subscribed to your thread (${thread_name}).`
                const notificationForThreadOwner = await notification.create({notificationMessage: notiMessage, dateTime: currentDateTime});
                await user.updateOne({"_id": Thread.userCreated._id}, {$push: {notifications: notificationForThreadOwner}});

                const threadEmail = Thread.userCreated.email;
                const subscriber = username;
                const threadName = thread_name;
                await sendEmailToThreadCreator(threadEmail, subscriber, threadName);

                res.json(User);
            }
        }
    }
});
router.post('/unsubscribe', async (req,res)=>{
    mongoose.connect(process.env.MONGO_URL);

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
            await user.updateOne({"_id": User._id},{$pull:{"subscribed": Thread._id}});
            await thread.updateOne({"_id": Thread._id}, {$pull: {"allSubscribers": User._id}});
            res.json(User);
        }
    }
});
router.post('/remove',async (req,res)=>{
    mongoose.connect(process.env.MONGO_URL);
    const client = new S3Client({
        region: 'us-east-2',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        },
    });
    const {thread_name} = req.body;
    //remove users subscribed to thread
    const Thread = await thread.findOne({threadname:thread_name});
    if(!Thread){
        res.status(400).json("could not find thread to delete");
    }
    else{
       await user.updateMany({subscribed:{$in:[Thread._id]}},{$pull:{"subscribed": Thread._id}});
      
       if(Thread.threadImgUrl){
        await client.send(new DeleteObjectCommand({
            Bucket:"seng401project",
            Key: Thread.threadImgUrl
        }));
    }
        for(k of Thread.votes){
            await vote.deleteOne({"_id":k});
        }
        postcount = Thread.posts.length;
        postsdeleted = 0;
        for(i of Thread.posts){
            Post = await post.findOne({"_id": i});
             if(Post.postImgUrl){
                await client.send(new DeleteObjectCommand({
                     Bucket:"seng401project",
                    Key: Post.postImgUrl
                }));
                
            }
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
            res.status(200).json("Thread successfully deleted");
        }
        else{
            res.status(400).json("Thread deletion failed");
        }
    }
});

router.put('/likethread', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    const {threadID, userID} = req.body;
    var tid = mongoose.Types.ObjectId(threadID);
    var uid = mongoose.Types.ObjectId(userID);
    const voteDoc = await vote.findOne({username: uid, threadId: tid});
    const User = await user.findOne({_id: uid});
    if (voteDoc){
        res.status(400).send("Already liked this post");
    } else {
        // Create a notification for thread owner that 
        const threadDoc = await thread.findOne({_id: threadID});
        const currentDateTime = new Date();
        const threadCreator = threadDoc.userCreated;
        const notiMessage = `${User.username} liked your thread (${threadDoc.threadname})!`;
        const notiForAuthor = await notification.create({notificationMessage: notiMessage, dateTime: currentDateTime});
        await user.updateOne({"_id": threadCreator}, {$push: {"notifications": notiForAuthor}});

        const newVote = await vote.create({username: uid, threadId: tid});
        const updatedThreadDoc = await thread.findOneAndUpdate(
            {_id: tid},
            {$push: {votes: newVote}},
            {returnOriginal: false}
        );
        if (updatedThreadDoc){
            res.json(updatedThreadDoc.votes);
        }
    }
});

router.put('/dislikethread', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    const {threadID, userID} = req.body;
    var tid = mongoose.Types.ObjectId(threadID);
    var uid = mongoose.Types.ObjectId(userID);
    // Find vote to be deleted (from vote collection)
    const voteDoc = await vote.findOne({username: uid, threadId: tid});
    if (voteDoc){
        // Remove vote from thread
        const updatedThreadDoc = await thread.findOneAndUpdate(
            {_id: tid},
            {$pull: {votes: voteDoc._id}},
            {returnOriginal: false}
        );
        await vote.deleteOne({_id: voteDoc._id});
        if (updatedThreadDoc){
            res.json(updatedThreadDoc.votes);
        }
        
    } else {
        res.status(400).send("Already disliked this post");
    }
    // Delete vote from collection
});

router.get("/allthreadnames", async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    res.json(
        await thread.find({}, {threadname:1})
    )
});

router.get("/getallthreads", async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    res.json(
        {threads: await thread.find({}, {}).populate('userCreated', 'username'), 
        users: await user.find({}, {posts:1, username:1, profilePicture:1}).limit(10),
        }
    )
});

router.put('/update', uploadMiddleware.single('threadFile'), async (req, res) => {
    // let newPath = null;
    // if (req.file){
    //     const {originalname, path, mimetype} = req.file;
    //     const parts = originalname.split('.');
    //     const extension = parts[parts.length - 1];
    //     newPath = path + '.' + extension;
    //     filesystem.renameSync(path, newPath);
    // }
    mongoose.connect(process.env.MONGO_URL);

    const {username, threadname, description} = req.body;
    const userDoc = await user.findOne({username:username});
    if (!userDoc){
        res.status(400).json("Could not find user");
    } else {
        let imageURL = null;
        if (req.file){
            const {originalname, path, mimetype} = req.file;
            imageURL = await uploadToS3(path, originalname, mimetype);
        }
        const threadDoc = await thread.findOne({threadname:threadname});
        await threadDoc.update({threadname, description, threadImgUrl: imageURL ? imageURL : threadDoc.threadImgUrl});
        res.status(200).json(threadDoc);
    }

});



module.exports = router;
