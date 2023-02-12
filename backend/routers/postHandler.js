const express = require("express");
const router = express.Router();

router.post('/posts',(req,res)=> {
    const {thread,title,body} = req.body;
    //insert post to database
    
});

router.get('/posts/:post_name',(req,res)=> {
    const {post_name} = req.params;
    //find post in database
    
});

module.exports = router;