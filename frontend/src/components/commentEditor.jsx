import React, { useState, useContext } from "react";
import "./commentEditor.css";
import AddIcon from '@mui/icons-material/Add';
import { UserContext } from "../context/userContext";

// Toast notifications
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CommentEditor(props){

    const {userInfo} = useContext(UserContext);
    const [newComment, setNewComment] = useState('');

    async function addNewComment(event){
        event.preventDefault();
        if (Object.entries(userInfo).length !== 0){
            const commentUser = userInfo.username;
            const postID = props.postID;

            if (!/\S/.test(newComment)){
                toast.error("Comment is empty!");
            } else {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/comments/create`, {
                    method: 'POST',
                    body: JSON.stringify({post_id: postID, body: newComment, username: commentUser}),
                    headers: {'Content-Type':'application/json'},
                    credentials: 'include'
                });
                if (response.ok){
                    window.location.reload();
                } else {
                    alert("Error adding comment!");
                }
            }
        } else {
            toast.error("You must login to add comments!");
        }
    }

    return(
        <div className="editor-container">
            <textarea placeholder="What are your thoughts?" 
                value={newComment} 
                onChange={(ev) => setNewComment(ev.target.value)}/>
            <div className="add-comment-btn" onClick={addNewComment}>
                <AddIcon fontSize="small"/> Comment
            </div>
        </div>
    );
}

export default CommentEditor;