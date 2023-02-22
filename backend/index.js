// Index JS File for backend
const mongoose = require('mongoose');
const express = require('express');
const threadHandler = require('./routers/threadHandler.js');
const userHandler = require('./routers/userHandler.js');
const postHandler = require('./routers/postHandler.js');
const commentHandler = require('./routers/commentHandler.js');
const voteHandler = require('./routers/voteHandler.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const app = express();
//database connection
//mongoose.connect(***REMOVED***);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());


app.use(express.json());
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use('/threads',threadHandler);
app.use('/users',userHandler);
app.use('/posts',postHandler);
app.use('/comments',commentHandler);
app.use('/votes',voteHandler);

const PORT = 5000;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}. `);
});





