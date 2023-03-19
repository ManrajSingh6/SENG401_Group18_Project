const express = require("express");
const router = express.Router();
const user = require('../models/userInfo.js');
const thread = require('../models/thread.js');
const vote = require('../models/vote.js');
const post = require('../models/post.js');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../configs/.env')});

const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});
const filesystem = require('fs');

router.post('/register', async (req,res)=>{
    const{username,password,email} = req.body;

    if( await user.findOne({username:username}).exec() ){
        res.status(400).json('username is taken');
    }
    else if(await user.findOne({email:email}).exec()){
        res.status(400).json("email is taken");
    }
    else{  //add user to database
        const User = await user.create({username,password:bcrypt.hashSync(password,10),email});
        res.json(User);
    }
    
 
});

router.get('/find/:id', async (req,res)=> {
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
    const {username} = req.query;
    //get user from database
    
    const User = await user.findOne({username:username});
    if(User){
        const allPosts = await post.find({author: User._id}).populate('thread', 'threadname');
        let subbedThreads = [];
        for (let i = 0; i < User.subscribed.length; i++){
            const sThread = await thread.findOne({_id: User.subscribed[i]}).populate('userCreated', 'username');
            subbedThreads.push(sThread);
        }
        res.send({User, userPosts: allPosts, subscribedThreads: subbedThreads});
    }
    else{
        res.status(400).send('User not found');
    }
    
});


router.post('/login',async (req,res)=>{

    const{username,password} = req.body;
    //check for user in database
    const userDoc = await user.findOne({username});
    if(userDoc){
        if(bcrypt.compareSync(password, userDoc.password)){
            jwt.sign({username, id: userDoc._id},process.env.JWT_SECRET,{},(error,auth)=>{
                if (error) throw error;
                res.cookie('auth',auth, {maxAge: 60*60*1000,httpOnly:true,sameSite:'lax',secure:true}).json({username, id: userDoc._id});
            });
        }
    }
    else{
        res.status(400).json('username or password is incorrect');
    }

});


router.post('/logout',async (req,res)=>{
    res.cookie('auth','').json();
});

router.post('/remove',async (req,res)=>{
    const{username} = req.body;
     //delete user from database
     
     const User = await user.findOne({username:username});
    if(!User){
        res.status(400).json("could not find user to delete");
    }
    else{
        if(User.profilePicture && User.profilePicture!=="uploads\\defaultUserProPic.png"){
            filesystem.unlink(User.profilePicture,(err)=>{
                if(err){
                    console.log(err);
                }
            });
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
                var vt = Votes = await vote.find({},{});
               vt.forEach(async function(v){
                    
                    vote_id = v._id;
                    
                    if(v.username.equals(User._id) && !v.commentId){
                        await fetch("http://localhost:5000/votes/post/remove", {
                        method: 'POST',
                        body: JSON.stringify({vote_id}),
                        headers: {'Content-Type' : 'application/json'},
                        credentials: 'include'
                        
                    });
                    
           
                    }
                    else if(v.username.equals(User._id) && !v.postId){
                        await fetch("http://localhost:5000/votes/comment/remove", {
                            method: 'POST',
                            body: JSON.stringify({vote_id}),
                            headers: {'Content-Type' : 'application/json'},
                            credentials: 'include'
                            
                        });
                    }
                    
                });
                
                const status = await user.deleteOne({username: username});
                 if(status.deletedCount == 1){
                    res.status(200).json("User successfully deleted");
                }
                else{
                    res.status(400).json("User could not be deleted");
                }
                
            }
            else{
                res.status(400).json("Posts of User could not be deleted");
            }
        }
        else{
            res.status(400).json("Comments of User could not be deleted");
        }
    }
    
});

router.get('/verifyprofile', async (req, res, next) => {
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

router.put('/updateprofile', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file){
        const {originalname, path} = req.file;
        const parts = originalname.split('.');
        const extension = parts[parts.length - 1];
        newPath = path + '.' + extension;
        filesystem.renameSync(path, newPath);
    }
    const {newDesc, username} = req.body;

    const userDoc = await user.findOne({username: username});
    if(userDoc.profilePicture && userDoc.profilePicture!=="uploads\\defaultUserProPic.png"){
        filesystem.unlink(userDoc.profilePicture,(err)=>{
            if(err){
                console.log(err);
            }
        });
    }
    const updatedDoc = await user.findOneAndUpdate(
        {username: username},
        {description: newDesc === '' ? userDoc.description : newDesc, profilePicture: newPath ? newPath : userDoc.profilePicture},
        {returnOriginal: false}
    );

    if (updatedDoc){
        res.json(updatedDoc);
    } else {
        res.status(400).send("Error updating fields");
    }   
    
});

module.exports = router;