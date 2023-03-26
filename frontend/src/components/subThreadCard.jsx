import React from "react";
import "./subbedThreads.css";
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ArticleIcon from '@mui/icons-material/Article';
import { Link, useParams } from "react-router-dom";

// React Toast Notifications
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Confirm popup
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

function SubbedThreadCard(props){
    const {username} = useParams();
    async function unsubscribeThread() {
        const response = await fetch('http://localhost:5000/threads/unsubscribe', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({thread_name: props.threadName, username: username}),
            headers: {'Content-Type':'application/json'},
        });

        if (response.ok){
            window.location.reload();
        } else {
            toast.error("Unable to unsubscribe to thread.");
        }
    }

    function confirmUnsubscribe(){
        confirmAlert({
            customUI: ({onClose}) => {
                return (
                    <div className="custom-ui">
                        <h2>Confirm Unsubscribe.</h2>
                        <p>Are you sure you want to do this? This action cannot be undone.</p>
                        <button onClick={() => {unsubscribeThread(); onClose()}}>Yes</button>
                        <button onClick={onClose}>No</button>
                    </div>
                );
            }
        });
    }

    return(
        <div className="sub-thread-card">
            <Link className="view-link" style={{alignSelf: "start"}} to={`/${props.threadName}`}><h4>{props.threadName}</h4></Link>
            <p className="creator-info">Created by {props.name} • {new Date(props.date).toLocaleDateString()} • {new Date(props.time).toLocaleTimeString()}</p>
            <div className="likes-comments">
                <div><ThumbUpRoundedIcon /> {props.likes}</div>
                <div><ArticleIcon /> {props.comments}</div>
            </div>
            <p role="button" onClick={confirmUnsubscribe} className="post-option-btn" style={{alignSelf: "center", color: "red"}}>Unsubscribe</p>
        </div>
    );
}

export default SubbedThreadCard; 