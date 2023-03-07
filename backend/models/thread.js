const mongoose = require('mongoose');
const {Schema,model} = mongoose;
const threadSchema = new mongoose.Schema({
    threadname: {type:String,required:true},
    description:{type:String,required:true},
    userCreated: {type:Schema.Types.ObjectId,ref:'User',required:true},
    posts: [{type:Schema.Types.ObjectId,ref:'Post'}],
    dateCreated: {
        type: Date,
        default: Date.now()
    },
    threadImgUrl: String,
    votes: [{type:Schema.Types.ObjectId,ref:'Vote'}],
});
module.exports = mongoose.model('Thread', threadSchema);