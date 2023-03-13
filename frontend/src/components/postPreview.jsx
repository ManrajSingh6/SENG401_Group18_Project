import React from "react";
import "./postPreview.css";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import { Link } from "react-router-dom";

const tempStyle={
    color: "grey",
    fontSize: "0.9rem"
}

function PostPreview(props){
    return(
        <div className="post-preview-container">
            <p style={tempStyle}>{props.postDate} | {props.postTime}</p>
            <Link 
                className="post-title-link" 
                to={`/${props.parentThread}/post/${props.postID}`}><h2>{props.postTitle}</h2></Link>
            <p style={tempStyle}>Posted by {props.postUser}</p>
            <p>{props.postSumm}</p>
            <div className="icons-divs">
                <div><ThumbUpIcon /> {props.postLikes ? (Object.keys(props.postLikes).length) : 0}</div>
                <div><CommentIcon /> {props.postComments ? (Object.keys(props.postLikes).length) : 0}</div>
            </div>        
        </div>
    );
}

export default PostPreview;