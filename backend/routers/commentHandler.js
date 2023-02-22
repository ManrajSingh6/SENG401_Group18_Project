
const express = require("express");
const comment = require('../models/comment.js');
const router = express.Router();

router.post('/',async (req,res)=> {
    const {username,body,time,votes} = req.body;
     //insert comment to database
    const Comment = await comment.create(username,body,time,votes);
    res.json(Comment);
    
});



module.exports = router;