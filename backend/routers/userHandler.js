const express = require("express");
const router = express.Router();
const user = require('../models/userInfo.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

router.post('/register', async (req,res)=>{
    const{username,password,email} = req.body;

    console.log("RU: " + username);
    console.log("RP: " + password);

    if( await user.findOne({username:username}).exec()){
        res.status(400).json('username is taken');
    }
    else{  //add user to database
        const User = await user.create({username,password:bcrypt.hashSync(password,10),email});
        res.json(User);
    }
    
 
});

router.get('/find', async (req,res)=> {
    const {username} = req.query;
    //get user from database

    console.log("Finding: " + username);
    
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
                if (error) throw error;
                res.cookie('auth',auth).json({username, id: userDoc._id});
            });
        }
    }
    else{
        res.status(400).json('username or password is incorrect');
    }

});


router.post('/logout',async (req,res)=>{
    res.cookie('auth','');
   
});

router.post('/remove',async (req,res)=>{
    const{username} = req.body;
     //delete user from database
    const status = await user.deleteOne({username: username});
    if(status.deletedCount == 1){
        res.status(200).json("User succesfully deleted");
    }
    else{
        res.status(400).json("User could not be deleted");
    }
    
});

router.get('/verifyprofile', (req, res) => {
    const {auth} = req.cookies;
    jwt.verify(auth, process.env.JWT_SECRET, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    });
});

module.exports = router;