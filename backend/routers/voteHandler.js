const express = require("express");
const vote = require('../models/vote.js');
const router = express.Router();

router.post('/votes',(req,res)=> {
    const {username,commentID,postID,direction} = req.body;
    //insert vote to database
    const Vote = vote.create(username,commentID,postID,direction);
    res.json(Vote);
    
});



module.exports = router;