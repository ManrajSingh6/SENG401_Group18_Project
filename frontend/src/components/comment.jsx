import React from "react";
import "./comment.css";

import propic from "../images/ironmanTemp.png";

import { dummyText } from "../pages/dummytext";

function Comment(props){
    return(
        <div className="main-comment-container">
            <div className="pro-pic-container">
                <img src={propic} alt="pro-pic"/>
            </div>
            <div className="comment-info-container">
                <p>Username1 at 10:59 | <span>30 likes</span></p>
                <p>{dummyText}</p>
            </div>
        </div>
    );
}

export default Comment;