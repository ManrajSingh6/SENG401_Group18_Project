import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import PostPreview from "../components/postPreview";

import "./threadPage.css";

function ThreadPage({parentThread}){

    
    const [parentThreadInfo, setParentThreadInfo] = useState([]);
    const [nestedPosts, setNestedPosts] = useState([]);

    const splitPath = (window.location.pathname).split("/");
    const threadName = splitPath[splitPath.length -1];

    useEffect(() => {
        fetch(`http://localhost:5000/threads/allpostsbythread?thread_name=${threadName}`).then(res => {
            res.json().then(response => {
                setParentThreadInfo(response[0]);
                setNestedPosts(response.slice(1));
                console.log(parentThreadInfo);
            });
        });
    }, []);

    return(
        <div className="thread-post-container">
            <h1>{parentThreadInfo.parentThreadName}</h1>
            <p style={{textAlign: "center", marginTop: "10px", fontWeight: "500"}}>{parentThreadInfo.description}</p>
            <p style={{marginTop: "10px", textAlign: "center", color: "#777777", marginBottom: "10px"}}>Created by {parentThreadInfo.userCreated} | {parentThreadInfo.dateCreated?.substring(0, 10)} | {parentThreadInfo.dateCreated?.substring(11, 19)}</p>
            <Grid container spacing={2} style={{marginTop: 30}}>
                {
                    nestedPosts.map((post) => {
                        return (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={post._id}>
                                <PostPreview
                                    key={post._id}
                                    postID={post._id} 
                                    postTitle={post.title}
                                    postDate={post.time.substring(0, 10)}
                                    postTime={post.time.substring(11, 19)}
                                    postUser={post.author}
                                    parentThread={parentThreadInfo.parentThreadName}
                                    postSumm={post.summary}
                                    postLikes={post.votes}
                                    postComments={post.comments}
                                />
                            </Grid>
                        )
                    })
                }
            </Grid>
        </div>
    );
}

export default ThreadPage;