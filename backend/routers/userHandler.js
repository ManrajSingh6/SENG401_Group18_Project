const express = require("express");
const router = express.Router();
const user = require('../models/userInfo.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

router.post('/register', async (req,res)=>{
    const{username,password,email} = req.body;
    if( await user.findOne({username:username}).exec()){
        res.status(400).json('username is taken');
    }
    else{  //add user to database
        const User = await user.create({username,password:bcrypt.hashSync(password,10),email});
        res.json(User);
    }
    
 
});

router.get('/:username', async (req,res)=> {
    const {username} = req.params;
    //get user from database
    const User = await user.findOne({username: username});
    res.json(User);
    
});

router.post('/login',async (req,res)=>{

    const{username,password} = req.body;
     //check for user in database
    const User = await user.findOne({username});
    if(User){
        if(bcrypt.compareSync(password,User.password)){
            jwt.sign({username},process.env.JWT_SECRET,{},(error,auth)=>{
                res.cookie('auth',auth).json({username});
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

router.post('/delete',async (req,res)=>{
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

module.exports = router;