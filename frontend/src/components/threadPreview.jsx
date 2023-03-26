import React, {useContext, useState} from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/userContext";
import "./threadPreview.css";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

// React Toast Notifications
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ThreadPreview(props){
    const {userInfo} = useContext(UserContext);
    const [threadLikes, setThreadLikes] = useState(props.likes);
    const [isSuccess, setSuccess] = useState();
    const [isError, setError] = useState();
    const [errorMessage, setErrorMessage] = useState('');

    async function subscribeThread(){
        if (Object.keys(userInfo).length !== 0){
            const username = userInfo.username;
            const thread_name = props.threadTitle;
            const response = await fetch ('http://localhost:5000/threads/subscribe', {
                method: 'POST',
                body: JSON.stringify({thread_name, username}),
                headers: {'Content-Type':'application/json'},
                credentials: 'include'
            });
            if (response.ok){
                response.json().then(res => {
                    setErrorMessage("Successfully subscribed to thread.");
                    setError(false);
                    setSuccess(true);
                });
            } else {
                setErrorMessage("Already subscribed to thread.");
                setSuccess(false);
                setError(true);
            }
        } else {
            toast.error('You must login!');
        }
    }

    async function handleLike(event){
        if (Object.keys(userInfo).length !== 0){
            const userID = userInfo.id;
            const threadID = props.threadID;
            const choice = event.currentTarget.id;
            let response = null;
            if (choice === "like-btn" && userID !== null){
                console.log(choice);
                response = await fetch('http://localhost:5000/threads/likethread', {
                    method: 'PUT',
                    body: JSON.stringify({threadID, userID}),
                    headers: {'Content-Type':'application/json'},
                    credentials: 'include',
                });
                setSuccess(false);
                setError(false);
                setErrorMessage("Already liked this post.")
            }

            if (choice === "dislike-btn" && userID !== null){
                response = await fetch('http://localhost:5000/threads/dislikethread', {
                    method: 'PUT',
                    body: JSON.stringify({threadID, userID}),
                    headers: {'Content-Type':'application/json'},
                    credentials: 'include',
                });
                setSuccess(false);
                setError(false);
                setErrorMessage("Already disliked this post.")
            }

            if (response.ok){
                response.json().then(threadLikes => {
                    setThreadLikes(threadLikes.length);
                })
            } else {
                setError(true);
            }

        } else {
            toast.error('You must login!');
        }
    }

    return(
        <div className="thread-prev-container">
            <Link to={`/${props.threadTitle}`} state={{from: props.threadTitle, user: props.userCreated, date: props.dateCreated, time: props.timeCreated }}>
                <div className="thread-img-container">
                    <img src={"http://localhost:5000/" + props.img} alt="thread-preview"></img>
                </div>
            </Link>

            <div className="thread-info-container">
                <Link to={`/${props.threadTitle}`} 
                    className="thread-link" 
                    state={{from: props.threadTitle, user: props.userCreated, date: props.dateCreated, time: props.timeCreated }}>
                    <h3>{props.threadTitle}</h3></Link>
                    <p className="thread-datetime">Created by {props.userCreated} on {props.dateCreated} at {props.timeCreated}</p>
                    <p className="thread-desc">{props.threadDesc}</p>
                <div className="buttons-container">
                    <div role="button" className="button" onClick={subscribeThread}>Subscribe</div>
                    <div role="button" className="button" onClick={handleLike} id="like-btn"><ThumbUpIcon fontSize="small"/></div>
                    <div role="button" className="button" onClick={handleLike} id="dislike-btn"><ThumbDownIcon fontSize="small"/></div>
                    <p>{threadLikes} likes • {props.postAmount} posts</p>
                </div>
                {isSuccess ? (<p style={{color: "#198754", fontSize: "small"}}>{errorMessage}</p>) : null}
                {isError ? (<p style={{color: "red", fontSize: "small"}}>{errorMessage}</p>) : null}
            </div>
        </div>
    );
}

export default ThreadPreview;