import React, {useContext, useState} from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/userContext";

import "./threadPreview.css";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

function ThreadPreview(props){
    const {userInfo} = useContext(UserContext);
    const [threadLikes, setThreadLikes] = useState(props.likes);
    
    async function subscribeThread(){
        let username = null;
        if (userInfo){
            username = userInfo.username;
        } else {
            alert("You must login!");
        }

        const thread_name = props.threadTitle;

        const response = await fetch ('http://localhost:5000/threads/subscribe', {
            method: 'POST',
            body: JSON.stringify({thread_name, username}),
            headers: {'Content-Type':'application/json'},
            credentials: 'include'
        });

        if (response.ok){
            response.json().then(res => {
                console.log(res);
                console.log("Succesfully subscribed to thread");
            })
        }

    }

    async function handleLike(event){
        let userID = null;
        if (Object.entries(userInfo).length !== 0){
            userID = userInfo.id;
        } else {
            alert("You must login!");
        }
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
        }

        if (choice === "dislike-btn" && userID !== null){
            response = await fetch('http://localhost:5000/threads/dislikethread', {
                method: 'PUT',
                body: JSON.stringify({threadID, userID}),
                headers: {'Content-Type':'application/json'},
                credentials: 'include',
            });
        }

        if (response.ok){
            response.json().then(threadLikes => {
                setThreadLikes(threadLikes.length);
            })
        } else {
            console.log("Error");
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
                    <h3>{props.threadTitle}</h3>
                    <p className="thread-datetime">Created by {props.userCreated} | {props.dateTimeCreated.substring(0,10)} | {props.dateTimeCreated.substring(11,19)}</p>
                    <p className="thread-desc">{props.threadDesc}</p>
                </Link>

                <div className="buttons-container">
                    <div role="button" className="button" onClick={subscribeThread}>Subscribe</div>
                    <div role="button" className="button" onClick={handleLike} id="like-btn"><ThumbUpIcon fontSize="small"/></div>
                    <div role="button" className="button" onClick={handleLike} id="dislike-btn"><ThumbDownIcon fontSize="small"/></div>
                    <p>{threadLikes} likes | {props.postAmount} posts</p>
                </div>
            </div>
        </div>
    );
}

export default ThreadPreview;