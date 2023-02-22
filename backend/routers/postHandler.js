
const express = require("express");
const post = require('../models/post.js');
const router = express.Router();

router.post('/',async (req,res)=> {
    const {username,title,body} = req.body;
    //insert post to database
    const Post = await post.create(username,title,body);
    res.json(Post);
    
});

router.get('/:post_id', async (req,res)=> {
    const {post_id} = req.params;
    //find post in database
    const Post = await post.findById(post_id);
    res.json(Post);
    
});

module.exports = router;