
import mongoose from "mongoose";

const schema = new mongoose.Schema({
  username: {type:String,required:true},
  commentId: {type:mongoose.ObjectId,required:false},
  postId: {type:mongoose.ObjectId,required:false},
  direction: {type:Number,required:true}
});
const Vote = mongoose.model('Vote', schema);

export default Vote;
