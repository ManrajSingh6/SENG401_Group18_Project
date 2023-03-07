import React from "react";
import { Link } from "react-router-dom";

import "./threadPreview.css";

function ThreadPreview(props){
    
    return(
        <div className="thread-prev-container">
            <Link to={`/${props.threadTitle}`} state={{from: props.threadTitle, user: props.userCreated, date: props.dateCreated, time: props.timeCreated }}>
                <div className="thread-img-container">
                    <img src={"http://localhost:5000/" + props.img} alt="thread-image"></img>
                </div>
            </Link>

            <div className="thread-info-container">
                <Link to={`/${props.threadTitle}`} 
                    className="thread-link" 
                    state={{from: props.threadTitle, user: props.userCreated, date: props.dateCreated, time: props.timeCreated }}>
                    <h3>{props.threadTitle}</h3>
                    <p className="thread-datetime">Created by {props.userCreated} | {props.dateTimeCreated.substring(0,10)}</p>
                    <p className="thread-desc">{props.threadDesc}</p>
                </Link>

                <div className="buttons-container">
                    <div className="button"><a>Subscribe</a></div>
                    <div className="button"><a>Like Thread</a></div>
                    <p>{props.likes} likes | {props.postAmount} posts</p>
                </div>
            </div>
        </div>
    );
}

export default ThreadPreview;