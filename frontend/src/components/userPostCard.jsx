import React from "react";
import "./subbedThreads.css";

import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { Link } from "react-router-dom";

function UserPostCard(props){
    return(
        <div className="sub-thread-card">
            <h4>{props.postName}</h4>
            <p style={{color: "#888888", fontWeight: 300, fontSize: "0.9rem"}}>in {props.parentThread} ({props.dateCreated.substring(0,10)} | {props.timeCreated.substring(11, 19)})</p>
            <div className="likes-comments">
                <div><ThumbUpRoundedIcon /> {props.postLikes}</div>
                <div><MessageRoundedIcon /> {props.postComments}</div>
            </div>
            <Link to={`/${props.parentThread}/post/${props.postID}`} className="view-link"><div className="view-post-btn"><VisibilityRoundedIcon />View Post</div></Link>
        </div>
    );
}

export default UserPostCard; 