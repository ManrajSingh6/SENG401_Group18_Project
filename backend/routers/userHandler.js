const express = require("express");
const router = express.Router();
const user = require('../models/userInfo.js');
const bcrypt = require('bcrypt');


router.post('/register', async (req,res)=>{
    const{username,password,email} = req.body;
    if( await user.findOne({username:username}).exec()){
        res.status(400).json('username is taken');
    }
    else{  //add user to database
        hashedPass = bcrypt.hash(password,10);
        const User = await user.create(username,hashedPass,email);
        res.json(User);
    }
    
 
});

router.get('/users/:username', async (req,res)=> {
    const {username} = req.params;
    //get user from database
    const User = await user.findOne({username: username});
    res.send(User);
    
});

router.post('/login',async (req,res)=>{

    const{username,password} = req.body;
     //check for user in database
    const User = await user.findOne({username:username});
    if(bcrypt.compare(password,User.password)){
        jwt.sign({username},process.env.JWT_SECRET,{},(error,auth)=>{
            res.cookie('auth',auth);
        });
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