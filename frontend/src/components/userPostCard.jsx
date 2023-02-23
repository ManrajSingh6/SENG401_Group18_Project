import React from "react";
import "./subbedThreads.css";

import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';

function UserPostCard(props){

    function openPost(){
        // Upon the click of a post - open the specific post page here
    }

    return(
        <div className="sub-thread-card">
            <h4>{props.postName}</h4>
            <p style={{color: "#888888", fontWeight: 300, fontSize: "0.9rem"}}>in {props.parentThread} ({props.dateCreated} | {props.timeCreated})</p>
            <div className="likes-comments">
                <div><ThumbUpRoundedIcon /> {props.postLikes}</div>
                <div><MessageRoundedIcon /> {props.postComments}</div>
            </div>
            <div className="view-post-btn" onClick={openPost}><VisibilityRoundedIcon />View Post</div>
        </div>
    );
}

export default UserPostCard; 