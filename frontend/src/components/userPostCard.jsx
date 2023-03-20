import React from "react";
import "./subbedThreads.css";

import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import { Link } from "react-router-dom";

function UserPostCard(props){

    async function deletePost(){
        const response = await fetch('http://localhost:5000/posts/remove', {
            method: 'POST',
            body: JSON.stringify({post_id: props.postID}),
            headers: {'Content-Type':'application/json'},
            credentials: 'include',
        });

        if (response.ok){
            console.log("Succesfully deleted post");
            window.location.reload();
        } else {
            alert("Unable to delete the post.")
        }
    }

    return(
        <div className="sub-thread-card">
            <h4>{props.postName}</h4>
            <p style={{color: "#888888", fontWeight: 300, fontSize: "0.9rem"}}>in {props.parentThread} ({props.dateCreated.substring(0,10)} | {props.timeCreated.substring(11, 19)})</p>
            <div className="likes-comments">
                <div><ThumbUpRoundedIcon /> {props.postLikes}</div>
                <div><MessageRoundedIcon /> {props.postComments}</div>
            </div>
            <div className="post-options-container">
                <Link to={`/${props.parentThread}/post/${props.postID}`} className="view-link"><p className="post-option-btn">View Post</p></Link>
                <Link to={`/edit-post/${props.postID}`} className="view-link"><p role="button" className="post-option-btn" style={{color: "#004696"}}>Edit Post</p></Link>
                <p onClick={deletePost} role="button" className="post-option-btn" style={{color: "red"}}>Delete Post</p>
            </div>
        </div>
    );
}

export default UserPostCard; 