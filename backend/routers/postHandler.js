const express = require("express");
const mongoose = require("mongoose");
const post = require('../models/post.js');
const user = require('../models/userInfo.js');
const thread = require('../models/thread.js');
const vote = require('../models/vote.js');
const comment = require('../models/comment.js');
const router = express.Router();

const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});
const filesystem = require('fs');

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

router.post('/create', uploadMiddleware.single('postFile'), async (req,res)=> {
    const {username, title, summary, body, parentThread} = req.body;

    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const extension = parts[parts.length - 1];
    const newPath = path + '.' + extension;
    filesystem.renameSync(path, newPath);
    
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
            const postDoc = await post.create({author: userDoc._id,title:title, summary: summary, body:body,thread: threadDoc._id, postImgUrl: newPath});
            if(postDoc){
                await thread.updateOne({"_id": threadDoc._id},{$push:{"posts": postDoc._id}});
                await user.updateOne({"_id": userDoc._id},{$push:{"posts": postDoc._id}})

                const allSubscribers = threadDoc.allSubscribers;
                if (allSubscribers.length !== 0){
                    for (var i = 0; i < allSubscribers.length; i++){
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
});

router.put('/update', uploadMiddleware.single('postFile'), async (req, res) => {
    let newPath = null;
    if (req.file){
        const {originalname, path} = req.file;
        const parts = originalname.split('.');
        const extension = parts[parts.length - 1];
        newPath = path + '.' + extension;
        filesystem.renameSync(path, newPath);
    }
    const {username, title, summary, body, postID} = req.body;
    const userDoc = await user.findOne({username:username});
    if (!userDoc){
        res.status(400).json("Could not find user");
    } else {
        const postDoc = await post.findById(postID);
        await postDoc.update({title, summary, body, postImgUrl: newPath ? newPath : postDoc.postImgUrl});
        res.status(200).json(postDoc);
    }

});

router.get('/find', async (req,res)=> {
    const {post_id} = req.query;
    //find post in database
    var post_objectId = mongoose.Types.ObjectId(post_id);
    const Post = await post.findById(post_objectId).populate('author', 'username').populate('thread', 'threadname');
    if(Post){
        const postCommentsData = await comment.find({postId: Post._id}).populate({path: 'author', select: 'username profilePicture', model: 'User'}).sort({time: 1});
        res.json({Post, postCommentsData});
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
       if(Post.postImgUrl){
        filesystem.unlink(Post.postImgUrl,(err)=>{
            if(err){
                console.log(err);
            }
        });
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