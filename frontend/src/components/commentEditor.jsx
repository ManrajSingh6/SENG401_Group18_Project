import React, { useState } from "react";
import "./commentEditor.css";
import AddIcon from '@mui/icons-material/Add';

function CommentEditor(){

    const [newComment, setNewComment] = useState('');

    function addNewComment(event){
        event.preventDefault();
        console.log(newComment);
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