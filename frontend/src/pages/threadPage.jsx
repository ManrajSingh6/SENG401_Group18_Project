import { Grid } from "@mui/material";
import React from "react";
import PostPreview from "../components/postPreview";

import { useLocation } from "react-router-dom";
import "./threadPage.css";

const summary = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Post Summary."
const posts = [
    {postTitle: "Why Ironman is Great", postDate: "2023-16-02", postTime: "10:59", postUser: "PostUser1", postSumm: summary, postLikes: 23, postComments: 17, postID: 1298},
    {postTitle: "Fuel Emissions are bad", postDate: "2023-16-02", postTime: "10:59", postUser: "PostUser2", postSumm: summary, postLikes: 34, postComments: 12, postID: 3454},
    {postTitle: "Fuel Emissions are bad", postDate: "2023-16-02", postTime: "10:59", postUser: "PostUser2", postSumm: summary, postLikes: 34, postComments: 12, postID: 3454},
    {postTitle: "Fuel Emissions are bad", postDate: "2023-16-02", postTime: "10:59", postUser: "PostUser2", postSumm: summary, postLikes: 34, postComments: 12, postID: 3454},
]

function ThreadPage({parentThread}){

    const location = useLocation();
    const {from, date, time, user} = location.state;

    return(
        <div className="thread-post-container">
            <h1>{from}</h1>
            <p style={{marginTop: "10px", textAlign: "center", color: "#777777", marginBottom: "10px"}}>Created by {user} | {date} | {time}</p>
        
            <Grid container spacing={2} style={{marginTop: 30}}>
                {
                    posts.map((post, index) => {
                        return (
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <PostPreview
                                    key={post.postID}
                                    postID={post.postID} 
                                    postTitle={post.postTitle}
                                    postDate={post.postDate}
                                    postTime={post.postTime}
                                    postUser={post.postUser}
                                    parentThread={from}
                                    postSumm={post.postSumm}
                                    postLikes={post.postLikes}
                                    postComments={post.postComments}
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