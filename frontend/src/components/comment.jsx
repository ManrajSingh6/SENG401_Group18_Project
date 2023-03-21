import React, {useContext, useState} from "react";
import "./comment.css";
import defaultProPic from "../images/defaultUserProPic.png";
import { UserContext } from "../context/userContext";
import ThumbUpIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDownOffAlt';

function Comment({commentUser, commentBody, commentDateTime, commentLikes, commentID}){
    const {userInfo} = useContext(UserContext);
    const [isError, setIsError] = useState();
    const [errorMessage, setErrorMessage] = useState('');

    async function handleLike(event){
        if (Object.entries(userInfo).length !== 0){
            const choice = event.currentTarget.id;
            
            let response = null;
            if (choice === "likeComment-btn"){
                response = await fetch('http://localhost:5000/votes/comment', {
                    method: 'POST',
                    body: JSON.stringify({username: userInfo.username, commentID}),
                    headers: {'Content-Type':'application/json'},
                    credentials: 'include'
                });
                setIsError(false);
                setErrorMessage('Already liked comment.');
            }

            if (choice === "dislikeComment-btn"){
                response = await fetch('http://localhost:5000/votes/comment/remove', {
                    method: 'POST',
                    body: JSON.stringify({username: userInfo.username, commentID}),
                    headers: {'Content-Type':'application/json'},
                    credentials: 'include'
                });
                setIsError(false);
                setErrorMessage('Already disliked comment.');
            }

            if (response.ok){
                setIsError(false);
                window.location.reload();
            } else {
                setIsError(true);
            }
        } else {
            alert("You must login!");
        }
    }

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
                <p>{commentUser?.username} <span style={{color:"grey", fontWeight: "400"}}>on {commentDateTime?.substring(0, 10)} at {commentDateTime?.substring(11, 19)}</span> 🞄 <span>{commentLikes} likes</span></p>
                <p>{commentBody}</p>

                {commentUser?.username === userInfo.username ? (
                    <p role="button" onClick={deleteComment} className="delete-comment-link" >Delete comment</p>
                ) : null}

            </div>
            <div className="like-unlike-container">
                <ThumbUpIcon role="button" className="icon" id="likeComment-btn" onClick={handleLike}/>
                <ThumbDownIcon role="button" className="icon" id="dislikeComment-btn" onClick={handleLike}/>
                {isError ? (<p style={{color: "red", fontSize: "small"}}>{errorMessage}</p>) : null}
            </div>
        </div>
    );
}

export default Comment;