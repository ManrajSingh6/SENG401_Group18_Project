import React from "react";

import "./threadPreview.css";

function ThreadPreview(props){
    return(
        <div className="thread-prev-container">
            <div className="thread-img-container">
                <img src={props.img}></img>
            </div>

            <div className="thread-info-container">
                <h3>{props.threadTitle}</h3>
                <p className="thread-datetime">Created by {props.userCreated} | {props.dateCreated} | {props.timeCreated}</p>
                <p className="thread-desc">{props.threadDesc}</p>

                <div className="buttons-container">
                    <div className="button"><a>Subscribe</a></div>
                    <div className="button"><a>Like Thread</a></div>
                    <p>{props.likes} likes | {props.comments} comments</p>
                </div>
            </div>
        </div>
    );
}

export default ThreadPreview;