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

// Confirm popup
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

function PostView(){

    const {userInfo} = useContext(UserContext);

    const [postData, setPostData] = useState([]);
    const [allPostComments, setAllPostComments] = useState([]);
    const [parentThread, setParentThread] = useState([]);
    const [isError, setIsError] = useState();
    const [errorMessage, setErrorMessage] = useState('');
    
    const splitPath = (window.location.pathname).split("/");
    const postID = splitPath[splitPath.length -1];

    useEffect(() => {
        fetch(`http://localhost:5000/posts/find?post_id=${postID}`).then(res => {
            res.json().then(resPostData => {
                setPostData(resPostData.Post);
                setAllPostComments(resPostData.postCommentsData);
                setParentThread(resPostData.parentThread);
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
    async function deletePost(){
        const response = await fetch('http://localhost:5000/posts/remove', {
            method: 'POST',
            body: JSON.stringify({post_id: postData._id}),
            headers: {'Content-Type':'application/json'},
            credentials: 'include',
        });

        if (response.ok){
            console.log("Succesfully deleted post");
            window.location.reload();
        } else {
            toast.error("Unable to delete post");
        }
    }

    function confirmDeletion(){
        confirmAlert({
            customUI: ({onClose}) => {
                return (
                    <div className="custom-ui">
                        <h2>Confirm deletion.</h2>
                        <p>Are you sure you want to do this? This action cannot be undone.</p>
                        <button onClick={() => {deletePost(); onClose()}}>Yes</button>
                        <button onClick={onClose}>No</button>
                    </div>
                );
            }
        });
    }


    return(
        <div className="main-post-container">
            <div className="post-content-container">
                <div className="post-info">
                    <p className="stats-text">Posted by {postData.author?.username} on {new Date(postData.time).toLocaleDateString()} at {new Date(postData.time).toLocaleTimeString()}</p>
                    <h1 className="post-info-title">{postData.title}</h1>
                    <p className="stats-text">{postData.votes ? (Object.keys(postData.votes).length) : 0} likes 🞄 {postData.comments ? (Object.keys(postData.comments).length) : 0} comments</p>
                    {   
                        // If the current logged in user = post author, give them permission to edit their post
                        postData.author?._id === userInfo?.id ?  (
                        <Link className="edit-post-link" to={`/edit-post/${postData._id}`}>
                            <div className="edit-post-btn">Edit Post</div>
                        </Link>
                    ) : null}
                    
                    {
                        // If the creator of the thread = current logged in user, allow them to delete the post (admin privileges)
                        parentThread?.userCreated === userInfo?.id?(
                        <Link className="edit-post-link" to={`/${parentThread.threadname}`}>
                        <p onClick={confirmDeletion} role="button" className="post-option-btn" style={{color: "red", fontSize: "small"}}>Delete Post (Admin)</p>
                        </Link>) : null
                    }
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
                            parentThread ={parentThread}
                        />
                    )
                })
            }
        </div>
    );
}

export default PostView;