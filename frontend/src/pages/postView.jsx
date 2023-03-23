import React, { useState, useEffect, useContext } from "react";
import "./postView.css";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Comment from "../components/comment";

import CommentEditor from "../components/commentEditor";
import { UserContext } from "../context/userContext";
import { Link } from "react-router-dom";

// Toast Notifications
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PostView(){

    const {userInfo} = useContext(UserContext);

    const [postData, setPostData] = useState([]);
    const [allPostComments, setAllPostComments] = useState([]);
    const [isError, setIsError] = useState();
    const [errorMessage, setErrorMessage] = useState('');
    
    const splitPath = (window.location.pathname).split("/");
    const postID = splitPath[splitPath.length -1];

    useEffect(() => {
        fetch(`http://localhost:5000/posts/find?post_id=${postID}`).then(res => {
            res.json().then(resPostData => {
                setPostData(resPostData.Post);
                setAllPostComments(resPostData.postCommentsData);
            });
        });
    }, []);

    async function handleLike(event) {
        if (Object.entries(userInfo).length !== 0){
            const username = userInfo.username;
            const postID = postData._id;
            const choice = event.currentTarget.id;
            let response = null;
            if (choice === "like-btn"){
                response = await fetch('http://localhost:5000/votes/post', {
                    method: 'POST',
                    body: JSON.stringify({username, postID}),
                    headers: {'Content-Type':'application/json'},
                    credentials: 'include'
                });
                setIsError(false);
                setErrorMessage("Already liked this post.");
            }

            if (choice === "dislike-btn"){
                response = await fetch('http://localhost:5000/votes/post/remove', {
                    method: 'POST',
                    body: JSON.stringify({username, postID}),
                    headers: {'Content-Type':'application/json'},
                    credentials: 'include'
                });
                setIsError(false);
                setErrorMessage("Already disliked this post.");
            }

            if (response.ok){
                window.location.reload();
            } else {
                setIsError(true);
            }
        } else {
            toast.error('You must login to like or dislike posts!');
        }
    }

    return(
        <div className="main-post-container">
            <div className="post-content-container">
                <div className="post-info">
                    <p className="stats-text">Posted by {postData.author?.username} on {new Date(postData.time).toLocaleDateString()} at {new Date(postData.time).toLocaleTimeString()}</p>
                    <h1 className="post-info-title">{postData.title}</h1>
                    <p className="stats-text">{postData.votes ? (Object.keys(postData.votes).length) : 0} likes 🞄 {postData.comments ? (Object.keys(postData.comments).length) : 0} comments</p>
                    {postData.author?._id === userInfo?.id ? (
                        <Link className="edit-post-link" to={`/edit-post/${postData._id}`}>
                            <div className="edit-post-btn">Edit Post</div>
                        </Link>
                    ) : null}
                    <p className="post-info content " dangerouslySetInnerHTML={{__html: postData.body}}></p>
                    <div style={{alignSelf: "center", display: "flex", gap: "20px", marginBottom: "10px", marginTop: "10px"}}>
                        <div className="like-btn" id="like-btn" onClick={handleLike} role="button">
                            <ThumbUpIcon fontSize="small"/>Like
                        </div>
                        <div className="like-btn" id="dislike-btn" onClick={handleLike} role="button">
                            <ThumbDownIcon fontSize="small"/>Dislike
                        </div>
                    </div>
                    {isError ? (<p style={{color: "red", textAlign: "center"}}>{errorMessage}</p>) : null}
                        
                </div>
                <div className="post-img-container">
                    <img src={'http://localhost:5000/' + postData.postImgUrl} alt="post-img"></img>
                </div>
            </div>

            <hr style={{marginTop:"15px", marginBottom: "15px"}}/>
            <h3 style={{textAlign: "center", marginBottom:"20px"}}>Comments</h3>
            <CommentEditor postID={postData._id}/>
            {
                allPostComments.map((comment) => {
                    return (
                        <Comment
                            key={comment._id} 
                            commentUser={comment.author}
                            commentBody={comment.body}
                            commentDateTime={comment.time}
                            commentLikes={comment.votes.length}
                            commentID={comment._id}
                        />
                    )
                })
            }
        </div>
    );
}

export default PostView;