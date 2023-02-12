const express = require("express");
const router = express.Router();


router.post('register',(req,res)=>{
    const{email,username,password} = req.body;
    res.json({requestData:{email,username,password}});
    //add user to database
    
 
});

router.get('/users/:username',(req,res)=> {
    const {username} = req.params;
    //get user from database
    
});

router.post('/login',(req,res)=>{
    const{username,password} = req.body;
    //check for user in database
    jwt.sign({username},process.env.JWT_SECRET,{},(error,auth)=>{
        res.cookie('auth',auth);
    });
});


router.post('/logout',(req,res)=>{
    res.cookie('auth','');
   
});


module.exports = router;