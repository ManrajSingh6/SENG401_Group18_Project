import React from "react";
import "./subbedThreads.css";
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import ArticleIcon from '@mui/icons-material/Article';
import { Link } from "react-router-dom";

function UserThreadCard(props){

    async function deleteThread(){
        const response = await fetch('http://localhost:5000/threads/remove', {
            method: 'POST',
            body: JSON.stringify({thread_name: props.threadName}),
            headers: {'Content-Type':'application/json'},
            credentials: 'include',
        });

        if (response.ok){
            console.log("Succesfully deleted thread");
            window.location.reload();
        } else {
            alert("Unable to delete the thread.")
        }
    }

    return(
       
         
        
         <div className="sub-thread-card">
         <Link className="view-link" style={{alignSelf: "start"}} to={`/${props.threadName}`}><h4>{props.threadName}</h4></Link>
         <p className="creator-info">Created by {props.name} | {props.date.substring(0, 10)} | {props.time.substring(11, 19)}</p>
         <div className="likes-comments">
             <div><ThumbUpRoundedIcon /> {props.likes}</div>
             <div><ArticleIcon /> {props.comments}</div>
         </div>
         <div className="post-options-container">
                <Link to={`/${props.threadName}`} className="view-link"><p className="post-option-btn">View Thread</p></Link>
                <Link to={`/edit-thread/${props.threadName}`} className="view-link"><p role="button" className="post-option-btn" style={{color: "#004696"}}>Edit Thread</p></Link>
                <p onClick={deleteThread} role="button" className="post-option-btn" style={{color: "red"}}>Delete Thread</p>
            </div>
     </div>
    );
}

export default UserThreadCard; 