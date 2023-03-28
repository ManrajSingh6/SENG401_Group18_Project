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
const path = require('path');

const app = express();

require('dotenv').config({path: path.resolve(__dirname, '../../configs/.env')});

//database connection
mongoose.connect(process.env.MONGO_URL);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(express.json());
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use('/threads',threadHandler);
app.use('/users',userHandler);
app.use('/posts',postHandler);
app.use('/comments',commentHandler);
app.use('/votes',voteHandler);



if (process.env.API_PORT){
    app.listen(process.env.API_PORT,()=>{
        console.log(`Server running on port ${process.env.API_PORT}. `);
    });
}

module.exports = app;





