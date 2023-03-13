import React, { useState, useEffect, useContext } from "react";
import "./postView.css";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Comment from "../components/comment";

import CommentEditor from "../components/commentEditor";
import { UserContext } from "../context/userContext";
import { Link } from "react-router-dom";

function PostView(){

    const {userInfo} = useContext(UserContext);

    const [postData, setPostData] = useState([]);
    const splitPath = (window.location.pathname).split("/");
    const postID = splitPath[splitPath.length -1];

    useEffect(() => {
        fetch(`http://localhost:5000/posts/find?post_id=${postID}`).then(res => {
            res.json().then(resPostData => {
                setPostData(resPostData);
            });
        });
    }, []);

    return(
        <div className="main-post-container">
            <div className="post-content-container">
                <div className="post-info">
                    <p className="stats-text">{postData.author} | {postData.author} | {postData.author}</p>
                    <h1 className="post-info-title">{postData.title}</h1>
                    <p className="stats-text">{postData.votes ? (Object.keys(postData.votes).length) : 0} Likes | {postData.comments ? (Object.keys(postData.comments).length) : 0} comments</p>
                    {postData.author === userInfo.id ? (
                        <Link className="edit-post-link">
                            <div className="edit-post-btn">Edit Post</div>
                        </Link>
                    ) : null}
                    <p className="post-info content " dangerouslySetInnerHTML={{__html: postData.body}}></p>
                    <div className="like-btn">
                        <ThumbUpIcon fontSize="small"/>Like
                    </div>
                </div>
                <div className="post-img-container">
                    <img src={'http://localhost:5000/' + postData.postImgUrl} alt="post-img"></img>
                </div>
            </div>

            <hr style={{marginTop:"15px", marginBottom: "15px"}}/>
            <h3 style={{textAlign: "center", marginBottom:"20px"}}>Comments</h3>
            <CommentEditor />
            {/* Add comments from database here */}
            <Comment />

        </div>
    );
}

export default PostView;