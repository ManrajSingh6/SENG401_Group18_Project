const express = require("express");
const router = express.Router();

const thread = require('../models/thread.js');
const bodyParser = require('body-parser');



router.post('/', async (req,res)=> {
    const {thread_name, thread_description} = req.body;
    //insert thread into database
    
});

router.get('/:thread_name',async (req,res)=> {
    const {thread_name} = req.params;
    //find thread from database
    
});

module.exports = router;