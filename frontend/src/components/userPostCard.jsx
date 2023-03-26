import React from "react";
import "./subbedThreads.css";

import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import { Link } from "react-router-dom";

// React Toast Notifications
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Confirm popup
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

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
            toast.error("Unable to delete the post.");
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
        <div className="sub-thread-card">
            <h4>{props.postName}</h4>
            <p style={{color: "#888888", fontWeight: 300, fontSize: "0.9rem"}}>in {props.parentThread} ({new Date(props.dateCreated).toLocaleDateString()} • {new Date(props.timeCreated).toLocaleTimeString()})</p>
            <div className="likes-comments">
                <div><ThumbUpRoundedIcon /> {props.postLikes}</div>
                <div><MessageRoundedIcon /> {props.postComments}</div>
            </div>
            <div className="post-options-container">
                <Link to={`/${props.parentThread}/post/${props.postID}`} className="view-link"><p className="post-option-btn">View Post</p></Link>
                <Link to={`/edit-post/${props.postID}`} className="view-link"><p role="button" className="post-option-btn" style={{color: "#004696"}}>Edit Post</p></Link>
                <p onClick={confirmDeletion} role="button" className="post-option-btn" style={{color: "red"}}>Delete Post</p>
            </div>
        </div>
    );
}

export default UserPostCard; 