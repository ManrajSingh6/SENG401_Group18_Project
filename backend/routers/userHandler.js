const express = require("express");
const router = express.Router();
const user = require('../models/userInfo.js');
const thread = require('../models/thread.js');
const vote = require('../models/vote.js');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/register', async (req,res)=>{
    const{username,password,email} = req.body;

    console.log("RU: " + username);
    console.log("RP: " + password);

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
        res.send(User);
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
                res.cookie('auth',auth).json({username, id: userDoc._id});
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
                    res.status(200).json("User succesfully deleted");
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

router.get('/verifyprofile', async (req, res) => {
    const {auth} = req.cookies;
    jwt.verify(auth, process.env.JWT_SECRET, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    });
});

module.exports = router;