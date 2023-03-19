import React, { useState, useContext } from "react";
import "./commentEditor.css";
import AddIcon from '@mui/icons-material/Add';
import { UserContext } from "../context/userContext";

function CommentEditor(props){

    const {userInfo} = useContext(UserContext);
    const [newComment, setNewComment] = useState('');

    async function addNewComment(event){
        event.preventDefault();
        console.log(newComment);
        console.log(userInfo);

        if (Object.entries(userInfo).length !== 0){
            const commentUser = userInfo.username;
            const postID = props.postID;

            const response = await fetch('http://localhost:5000/comments/create', {
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
        } else {
            alert ("You must login to add comments!");
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