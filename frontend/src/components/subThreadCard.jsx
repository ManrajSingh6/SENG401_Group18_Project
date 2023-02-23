import React from "react";
import "./subbedThreads.css";
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';

function SubbedThreadCard(props){

    function openThread(){
        // Upon the click of a thread - open the entire thread page here
    }

    return(
        <div className="sub-thread-card" onClick={openThread}>
            <h4>{props.threadName}</h4>
            <p className="creator-info">Created by {props.name} | {props.date} | {props.time}</p>
            <div className="likes-comments">
                <div><ThumbUpRoundedIcon /> {props.likes}</div>
                <div><MessageRoundedIcon /> {props.comments}</div>
            </div>
        </div>
    );
}

export default SubbedThreadCard; 