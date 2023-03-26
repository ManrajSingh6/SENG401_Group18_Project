import React from "react";
import "./subbedThreads.css";
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ArticleIcon from '@mui/icons-material/Article';
import { Link } from "react-router-dom";

// Confirm popup
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

// React Toast Notifications
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            toast.error("Unable to delete thread.");
        }
    }

    function confirmDeletion(){
        confirmAlert({
            customUI: ({onClose}) => {
                return (
                    <div className="custom-ui">
                        <h2>Confirm deletion.</h2>
                        <p>Are you sure you want to do this? This action cannot be undone.</p>
                        <button onClick={() => {deleteThread(); onClose()}}>Yes</button>
                        <button onClick={onClose}>No</button>
                    </div>
                );
            }
        });
    }

    return(
         <div className="sub-thread-card">
         <Link className="view-link" style={{alignSelf: "start"}} to={`/${props.threadName}`}><h4>{props.threadName}</h4></Link>
         <p className="creator-info">Created by {props.name} 🞄 {new Date(props.date).toLocaleDateString()} • {new Date(props.time).toLocaleTimeString()}</p>
         <div className="likes-comments">
             <div><ThumbUpRoundedIcon /> {props.likes}</div>
             <div><ArticleIcon /> {props.comments}</div>
         </div>
         <div className="post-options-container">
                <Link to={`/${props.threadName}`} className="view-link"><p className="post-option-btn">View Thread</p></Link>
                <Link to={`/edit-thread/${props.threadName}`} className="view-link"><p role="button" className="post-option-btn" style={{color: "#004696"}}>Edit Thread</p></Link>
                <p onClick={confirmDeletion} role="button" className="post-option-btn" style={{color: "red"}}>Delete Thread</p>
            </div>
     </div>
    );
}

export default UserThreadCard; 