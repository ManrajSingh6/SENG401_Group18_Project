import React from "react";
import "./subbedThreads.css";
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ArticleIcon from '@mui/icons-material/Article';
import { Link } from "react-router-dom";
function SubbedThreadCard(props){

    return(
        <div className="sub-thread-card">
            <Link className="view-link" style={{alignSelf: "start"}} to={`/${props.threadName}`}><h4>{props.threadName}</h4></Link>
            <p className="creator-info">Created by {props.name} | {props.date.substring(0, 10)} | {props.time.substring(11, 19)}</p>
            <div className="likes-comments">
                <div><ThumbUpRoundedIcon /> {props.likes}</div>
                <div><ArticleIcon /> {props.comments}</div>
            </div>
        </div>
    );
}

export default SubbedThreadCard; 