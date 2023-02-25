import React, { useState } from "react";
import "./postView.css";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Comment from "../components/comment";

import gtrIMG from "../images/ironmanTemp.png";

import { dummyText } from "./dummytext";
import CommentEditor from "../components/commentEditor";

function PostView(){    

    return(
        <div className="main-post-container">
            <div className="post-content-container">
                <div className="post-info">
                    <p className="stats-text">User1 | 2023-07-15 | 10:59</p>
                    <h1>Why Ironman is the GOAT</h1>
                    <p className="stats-text">23 Likes | 10 comments</p>
                    <p>{dummyText}</p>
                    <div className="like-btn">
                        <ThumbUpIcon fontSize="small"/>Like
                    </div>
                </div>
                <div className="post-img-container">
                    <img src={gtrIMG} alt="post-img"></img>
                </div>
            </div>

            <hr style={{marginTop:"15px", marginBottom: "15px"}}/>
            <h3 style={{textAlign: "center", marginBottom:"20px"}}>Comments</h3>
            <CommentEditor />
            {/* Add comments from database here */}
            <Comment />

        </div>
    );
}

export default PostView;