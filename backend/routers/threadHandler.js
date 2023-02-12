const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');



router.post('/threads',(req,res)=> {
    const {thread_name, thread_description} = req.body;
    //insert thread into database
    
});

router.post('/threads/:thread_name',(req,res)=> {
    const {thread_name} = req.params;
    //insert thread into database
    
});

module.exports = router;