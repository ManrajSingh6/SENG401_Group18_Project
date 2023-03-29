const express = require("express");
const router = express.Router();
const user = require('../models/userInfo.js');
const thread = require('../models/thread.js');
const vote = require('../models/vote.js');
const post = require('../models/post.js');
const notification = require('../models/notification.js');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../configs/.env')});

const multer = require('multer');
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

async function sendConfirmationEmail(destAddr, username){
    let mailOptions = {
        from: "seng401project@gmail.com",
        to: destAddr,
        subject: "The Loop: Account Registration Confirmation",
        text: `A new user account has been created for The Loop with the following credentials:
               email: ${destAddr}
               username: ${username}`
    };
    
    transporter.sendMail(mailOptions, function(err, success) {
        if (err) {
            console.log(err);
        } else {
            console.log("Email sent successfully");
        }
    });
}

router.post('/register', async (req,res)=>{
    mongoose.connect(process.env.MONGO_URL);

    const{username,password,email} = req.body;

    if( await user.findOne({username:username}).exec() ){
        res.status(400).json('username is taken');
    }
    else if(await user.findOne({email:email}).exec()){
        res.status(400).json("email is taken");
    }
    else{  //add user to database
        const User = await user.create({username,password:bcrypt.hashSync(password,10),email});
        await sendConfirmationEmail(email, username);
        res.json(User);
    }
});

router.get('/find/:id', async (req,res)=> {
    mongoose.connect(process.env.MONGO_URL);

    const {id} = req.params;
    //get user from database

    console.log("Finding: " + id);
    
    const User = await user.findOne({_id: id});
    if(User){
        res.send(User);
    }
    else{
        res.status(400).send('User not found');
    }
    
});

router.get('/find', async (req,res)=> {
    mongoose.connect(process.env.MONGO_URL);

    const {username} = req.query;
    //get user from database
    const User = await user.findOne({username:username});
    if(User){
        const allPosts = await post.find({author: User._id}).populate('thread', 'threadname');
        const createdThreads = await thread.find({userCreated:User._id}).populate('userCreated', 'username')
        let subbedThreads = [];
        for (let i = 0; i < User.subscribed.length; i++){
            const sThread = await thread.findOne({_id: User.subscribed[i]}).populate('userCreated', 'username');
            subbedThreads.push(sThread);
        }
        res.send({User, userPosts: allPosts, createdThreads: createdThreads,subscribedThreads: subbedThreads});
    }
    else{
        res.status(400).send('User not found');
    }
    
});


router.post('/login',async (req,res)=>{
    mongoose.connect(process.env.MONGO_URL);

    const{username,password} = req.body;
    //check for user in database
    const userDoc = await user.findOne({username:username});
    if(userDoc){
        if(bcrypt.compareSync(password, userDoc.password)){
            jwt.sign({username, id: userDoc._id},process.env.JWT_SECRET,{},(error,auth)=>{
                if (error) throw error;
                res.cookie('auth',auth, {httpOnly:true,sameSite:'lax',secure:true}).json({username, id: userDoc._id});
            });
        } else {
            res.status(400).json('password is incorrect');
        }
    } else {
        res.status(400).json('username is incorrect');
    }

});


router.post('/logout',async (req,res)=>{
    res.cookie('auth','').json();
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
    const{username} = req.body;
     //delete user from database
     
     const User = await user.findOne({username:username});
    if(!User){
        console.log("Error cant find user");
        res.status(400).json("could not find user to delete");
    }
    else{
        if(User.profilePicture && User.profilePicture!=="defaultUserProPic.png"){
            const parts = User.profilePicture.split('/');
            const key= parts[parts.length - 1];
            
            await client.send(new DeleteObjectCommand({
                Bucket:"seng401project",
                Key: key
            }));
        }
        
        commentStatus = true;
        postStatus = true;
        for(comment_id of User.comments){
            const response = await fetch("http://localhost:5000/comments/remove", {
                method: 'POST',
                body: JSON.stringify({comment_id}),
                headers: {'Content-Type' : 'application/json'},
            
            });
            if (!response.ok){
                commentStatus = false;
            } 

        }
        if(commentStatus){
            for(post_id of User.posts){
                const response = await fetch("http://localhost:5000/posts/remove", {
                    method: 'POST',
                    body: JSON.stringify({post_id}),
                    headers: {'Content-Type' : 'application/json'},
                
                });
        
                if (!response.ok){
                    postStatus = false;
                } 
            }
            if(postStatus){
                var ct = Threads = await thread.find({},{});
                ct.forEach(async function(t){
                    thread_name = t.threadname;
                    if(t.userCreated.equals(User._id)){
                        await fetch("http://localhost:5000/threads/remove", {
                        method: 'POST',
                        body: JSON.stringify({thread_name}),
                        headers: {'Content-Type' : 'application/json'},
                        credentials: 'include'
                    });
        
           
                    }
                });
                notificationStatus = true;
                for(nID of User.notifications){
                    nStatus =await notification.deleteOne({_id: nID});
                    if(nStatus.deletedCount != 1){
                        notificationStatus = false;
                    }
                }
                if(notificationStatus){
                    var vt  = await vote.find({},{});
                    for(v of vt){ 
                        if(v.username.equals(User._id) && !v.commentId&&!v.threadId){
                            await fetch("http://localhost:5000/votes/post/remove", {
                            method: 'POST',
                            body: JSON.stringify({username:username, postID: v.postId}),
                            headers: {'Content-Type' : 'application/json'},
                            credentials: 'include'
                        
                        });
                    
                        
                        }
                        else if(v.username.equals(User._id) && !v.postId&&!v.threadId){
                            await fetch("http://localhost:5000/votes/comment/remove", {
                                method: 'POST',
                                body: JSON.stringify({username: username, commentID: v.commentId}),
                                headers: {'Content-Type' : 'application/json'},
                                credentials: 'include'
                            
                            });
                         }
                        else if(v.username.equals(User._id) && !v.postId&&!v.commentId){
                            await fetch("http://localhost:5000/threads/dislikethread", {
                                method: 'PUT',
                                body: JSON.stringify({threadID: v.threadId,userID: User._id}),
                                headers: {'Content-Type' : 'application/json'},
                                credentials: 'include'
                            
                            });
                        }
                    }
                
                const status = await user.deleteOne({username: username});
                 if(status.deletedCount == 1){
                    res.status(200).json("User successfully deleted");
                }
                else{
                    console.log("Error cant delete user here");
                    res.status(400).json("User could not be deleted");
                }
                
            }
            else{
                res.status(400).json("Notifications of User could not be deleted");
            }
        }
            else{
                console.log("User posts cant be delete");
                res.status(400).json("Posts of User could not be deleted");
            }
        }
        else{
            console.log("User comments could not be deleted");
            res.status(400).json("Comments of User could not be deleted");
        }
    }
    
});

router.get('/verifyprofile', async (req, res, next) => {
    mongoose.connect(process.env.MONGO_URL);

    const {auth} = req.cookies;
    if (!auth) { return next(); }
    try {
        jwt.verify(auth, process.env.JWT_SECRET, {}, (err, info) => {
            if (err) throw err;
            res.json(info);
        });
        next();
    } catch (error) {
        res.status(401).json("Invalid token");
    }

    
});

const uploadMiddleware = multer({dest: '/tmp'});
router.put('/updateprofile', uploadMiddleware.single('file'), async (req, res) => {
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
    const {newDesc, username} = req.body;

    const userDoc = await user.findOne({username: username});
    if(userDoc.profilePicture && userDoc.profilePicture!=="defaultUserProPic.png"){
        filesystem.unlink(userDoc.profilePicture,(err)=>{
            if(err){
                console.log(err);
            }
        });
    }
    const updatedDoc = await user.findOneAndUpdate(
        {username: username},
        {description: newDesc === '' ? userDoc.description : newDesc, profilePicture: imageURL ? imageURL : userDoc.profilePicture},
        {returnOriginal: false}
    );

    if (updatedDoc){
        res.json(updatedDoc);
    } else {
        res.status(400).send("Error updating fields");
    }   
    
});
router.get('/findThreads', async (req, res, next) => {
    mongoose.connect(process.env.MONGO_URL);

    const {username} = req.query;
    const User = await user.findOne({username: username});
    if(User){
        res.json(await thread.find({userCreated:User._id}).populate('userCreated', 'username'));
    }
    else{
        res.status(400).json("User not found");
    }
}); 

router.get('/allnotifications', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    const {userID} = req.query;
    const User = await user.findOne({_id: userID});
    if (User){
        const allUserNotificatons = User.notifications;
        const notiArray = [];
        for (var i = 0; i < allUserNotificatons.length; i++){
            const notiDoc = await notification.findOne({_id: allUserNotificatons[i]._id});
            notiArray.push(notiDoc);
        }
        res.json(notiArray);
    } else {
        res.status(400).json("User not found!");
    }
});

router.post('/acknowledgenotification', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    const {userID, notificationID} = req.body;
    const User = await user.findOne({_id: userID});
    if (User){
        // Pull the notification from the User's notifications
        await user.updateOne({_id: userID},{$pull:{notifications: notificationID}});
        const status = await notification.deleteOne({_id: notificationID});
        if(status.deletedCount === 1){
            res.status(200).json("Notification succesfully deleted");
        }
        else{
            res.status(400).json("Notification deletion failed");
        }
    } else {
        res.status(400).json("User not found");
    }

});

module.exports = router;