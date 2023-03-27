import React, {useContext, useState} from "react";
import "./comment.css";
import { UserContext } from "../context/userContext";
import ThumbUpIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDownOffAlt';

// Toast notifications
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Comment({commentUser, commentBody, commentDateTime, commentLikes, commentID, parentThread}){
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
            toast.error('You must login!');
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
                <img src={commentUser?.profilePicture === 'defaultUserProPic.png' ? ("https://seng401project.s3.us-east-2.amazonaws.com/defaultUserProPic.png") : commentUser?.profilePicture} alt="comment-profile-pic"/>
            </div>
            <div className="comment-info-container">
                <p>{commentUser?.username} <span style={{color:"grey", fontWeight: "400"}}>on {new Date(commentDateTime).toLocaleDateString()} at {new Date(commentDateTime).toLocaleTimeString()}</span> • <span>{commentLikes} likes</span></p>
                <p>{commentBody}</p>

                {commentUser?.username === userInfo.username ? (
                    <p role="button" onClick={deleteComment} className="delete-comment-link" >Delete comment</p>
                ) : parentThread?.userCreated === userInfo?.id?(
                    <p role="button" onClick={deleteComment} className="delete-comment-link" >Delete comment</p>
                ): null}

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