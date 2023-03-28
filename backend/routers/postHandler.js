const express = require("express");
const mongoose = require("mongoose");
const post = require('../models/post.js');
const user = require('../models/userInfo.js');
const thread = require('../models/thread.js');
const vote = require('../models/vote.js');
const comment = require('../models/comment.js');
const notification = require('../models/notification.js');
const router = express.Router();
const filesystem = require('fs');
const multer = require('multer');

const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../configs/.env')});

// AWS S3 Client
const {S3Client, PutObjectCommand, DeleteObjectCommand} = require('@aws-sdk/client-s3');

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

async function sendPostNotifications(destAddr, username, title, summary, parentThread){
    let mailOptions = {
        from: "seng401project@gmail.com",
        to: destAddr,
        subject: `New Post Under Thread: ${parentThread}`,
        text: `You're recieving this email because a thread you've subscribed to (${parentThread}) has a new post! Here are a few details: \n\n\tPosted by: ${username} \n\tTitle: ${title} \n\tA short summary: ${summary} \n\nView the full post on The Loop!`
    };
    
    transporter.sendMail(mailOptions, function(err, success) {
        if (err) {
            console.log(err);
        } else {
            console.log("Email sent successfully");
        }
    });
}

const uploadMiddleware = multer({dest: '/tmp'});
router.post('/create', uploadMiddleware.single('postFile'), async (req,res)=> {
    mongoose.connect(process.env.MONGO_URL);
    
    const {username, title, summary, body, parentThread} = req.body;
    if(!req.file){
        const userDoc = await user.findOne({username:username});
        if(!userDoc){
            res.status(400).json("Could not find user");
        }
        else{
            const threadDoc = await thread.findOne({threadname: parentThread}).populate('allSubscribers', 'email');
            if(!threadDoc){
                res.status(400).json("Could not find thread");
            }
            else{
                //insert post to database
                const currentDateTime = new Date();
                const postDoc = await post.create({author: userDoc._id,title:title, summary: summary, body:body,thread: threadDoc._id, time: currentDateTime});
    
                if(postDoc){
                    await thread.updateOne({"_id": threadDoc._id},{$push:{"posts": postDoc._id}});
                    await user.updateOne({"_id": userDoc._id},{$push:{"posts": postDoc._id}})
    
                    const allSubscribers = threadDoc.allSubscribers;
                    if (allSubscribers.length !== 0){
                        for (var i = 0; i < allSubscribers.length; i++){
                            // Updating notification for thread creator
                            const currentDateTime = new Date();
                            const notiMessage = `New post in thread (${parentThread})`;
                            const notificationForSubscribers = await notification.create({notificationMessage: notiMessage, dateTime: currentDateTime});
                            await user.updateOne({"_id": allSubscribers[i]._id}, {$push: {notifications: notificationForSubscribers}});
    
                            await sendPostNotifications(allSubscribers[i].email, username, title, summary, parentThread);
                        }
                    }
    
    
                    res.json(postDoc);
                }
                else{
                    res.status(400).json("Post creation failed");
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
        res.status(400).json("Could not find user");
    }
    else{
        const threadDoc = await thread.findOne({threadname: parentThread}).populate('allSubscribers', 'email');
        if(!threadDoc){
            res.status(400).json("Could not find thread");
        }
        else{
            const imageURL = await uploadToS3(path, originalname, mimetype);
            //insert post to database
            const currentDateTime = new Date();
            const postDoc = await post.create({author: userDoc._id,title:title, summary: summary, body:body,thread: threadDoc._id, postImgUrl: imageURL, time: currentDateTime});

            if(postDoc){
                await thread.updateOne({"_id": threadDoc._id},{$push:{"posts": postDoc._id}});
                await user.updateOne({"_id": userDoc._id},{$push:{"posts": postDoc._id}})

                const allSubscribers = threadDoc.allSubscribers;
                if (allSubscribers.length !== 0){
                    for (var i = 0; i < allSubscribers.length; i++){
                        // Updating notification for thread creator
                        const currentDateTime = new Date();
                        const notiMessage = `New post in thread (${parentThread})`;
                        const notificationForSubscribers = await notification.create({notificationMessage: notiMessage, dateTime: currentDateTime});
                        await user.updateOne({"_id": allSubscribers[i]._id}, {$push: {notifications: notificationForSubscribers}});
                        
                        await sendPostNotifications(allSubscribers[i].email, username, title, summary, parentThread);
                    }
                }
                

                res.json(postDoc);
            }
            else{
                res.status(400).json("Post creation failed");
            }
        }
    }
}
});


router.put('/update', uploadMiddleware.single('postFile'), async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    let imageURL = null;
    if (req.file){
        const {originalname, path, mimetype} = req.file;
        // const parts = originalname.split('.');
        // const extension = parts[parts.length - 1];
        // newPath = path + '.' + extension;
        // filesystem.renameSync(path, newPath);
        imageURL = await uploadToS3(path, originalname, mimetype);
    }
    const {username, title, summary, body, postID} = req.body;
    const userDoc = await user.findOne({username:username});
    if (!userDoc){
        res.status(400).json("Could not find user");
    } else {
        const postDoc = await post.findById(postID);
        await postDoc.update({title, summary, body, postImgUrl: imageURL ? imageURL : postDoc.postImgUrl});
        res.status(200).json(postDoc);
    }

});

router.get('/find', async (req,res)=> {
    mongoose.connect(process.env.MONGO_URL);

    const {post_id} = req.query;
    //find post in database
    var post_objectId = mongoose.Types.ObjectId(post_id);
    const Post = await post.findById(post_objectId).populate('author', 'username').populate('thread', 'threadname');
    if(Post){
        const parentThread = await thread.findOne({posts:{$in:[Post._id]}});
        const postCommentsData = await comment.find({postId: Post._id}).populate({path: 'author', select: 'username profilePicture', model: 'User'}).sort({time: 1});
        res.json({Post, postCommentsData,parentThread});
    }
    else{
        res.status(400).json("Post could not be found");
    }
    
});

router.post('/remove',async (req,res)=> {
    mongoose.connect(process.env.MONGO_URL);
    const client = new S3Client({
        region: 'us-east-2',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        },
    });

    const {post_id} = req.body;
    var post_objectId = mongoose.Types.ObjectId(post_id);
    const Post = await post.findById(post_objectId);

    if(!Post){
        res.status(400).json("Could not find post to delete");
    }
    else{
       if(Post.postImgUrl){
            await client.send(new DeleteObjectCommand({
                Bucket:"seng401project",
                Key: Post.postImgUrl
            }));
        }
     
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