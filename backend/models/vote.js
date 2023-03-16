const mongoose = require('mongoose');
const {Schema,model} = mongoose;

const schema = new mongoose.Schema({
  username: {type:Schema.Types.ObjectId,ref:'User'},
  commentId: {type:mongoose.ObjectId,required:false},
  postId: {type:mongoose.ObjectId,required:false},
  threadId: {type:Schema.Types.ObjectId, ref:'Thread', required:false}
});

module.exports = mongoose.model('Vote', schema);

