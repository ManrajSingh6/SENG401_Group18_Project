import React, {useContext} from "react";
import "./comment.css";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import defaultProPic from "../images/defaultUserProPic.png";
import { UserContext } from "../context/userContext";

function Comment({commentUser, commentBody, commentDateTime, commentLikes, commentID}){
    const {userInfo} = useContext(UserContext);
    async function deleteComment(){
        const res = await fetch ('http://localhost:5000/comments/remove', {
            method: 'POST',
            body: JSON.stringify({comment_id: commentID}),
            headers: {'Content-Type':'application/json'},
            credentials: 'include'
        });

        if (res.ok){
            window.location.reload();
        } else {
            alert("Unable to delete comment");
        }
    }
    return(
        <div className="main-comment-container">
            <div className="pro-pic-container">
                <img src={commentUser?.profilePicture === 'defaultUserProPic.png' ? (defaultProPic): 'http://localhost:5000/' + commentUser?.profilePicture} alt="comment-profile-pic"/>
            </div>
            <div className="comment-info-container">
                <p>{commentUser?.username} <span style={{color:"grey", fontWeight: "400"}}>on {commentDateTime?.substring(0, 10)} at {commentDateTime?.substring(11, 19)} </span>| <span>{commentLikes} likes</span></p>
                <p>{commentBody}</p>

                {commentUser?.username === userInfo.username ? (
                    <p role="button" onClick={deleteComment} className="delete-comment-link" >Delete comment</p>
                ) : null}

            </div>
            <div><FavoriteBorderIcon/></div>
        </div>
    );
}

export default Comment;