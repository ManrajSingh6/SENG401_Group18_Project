import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import PostPreview from "../components/postPreview";
import SearchIcon from '@mui/icons-material/Search';

import "./threadPage.css";

function ThreadPage(){
    const [searchQuery, setSearchQuery] = useState('');
    const [tempQuery, setTempQuery] = useState('');

    const [parentThreadInfo, setParentThreadInfo] = useState([]);
    const [nestedPosts, setNestedPosts] = useState([]);

    const splitPath = (window.location.pathname).split("/");
    const threadName = splitPath[splitPath.length -1];

    // Fetch all thread information and nested posts upon page load
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/threads/allpostsbythread?thread_name=${threadName}`).then(res => {
            res.json().then(response => {
                setParentThreadInfo(response[0]);
                setNestedPosts(response.slice(1));
                console.log(nestedPosts);
            });
        });
    }, []);

    function handleSearch(event){
        event.preventDefault();
        setSearchQuery(tempQuery);
        setTempQuery('');    
    }

    return(
        <div className="thread-post-container">
            <h1>{parentThreadInfo.parentThreadName}</h1>
            <p style={{textAlign: "center", marginTop: "10px", fontWeight: "500"}}>{parentThreadInfo.description}</p>
            <p style={{marginTop: "10px", textAlign: "center", color: "#777777", marginBottom: "10px"}}>Created by {parentThreadInfo.userCreated} | {new Date(parentThreadInfo.dateCreated).toLocaleDateString()} | {new Date(parentThreadInfo.dateCreated).toLocaleTimeString()}</p>
            <div className="search-form-container">
                <input type="text"
                    placeholder="Search for a post by title or author" 
                    value={tempQuery}
                    onChange={ev => setTempQuery(ev.target.value)}/>
                <div className="search-container" onClick={handleSearch}>
                    <SearchIcon style={{color: "#FFFF"}}/>
                </div>
            </div>
            <Grid container spacing={2} style={{marginTop: 30}}>
                {
                nestedPosts.filter((val) => {
                    if (searchQuery === ""){ return val;} 
                    else if (val.title.toLowerCase().includes(searchQuery.toLowerCase()) || val.author.username.toLowerCase().includes(searchQuery.toLowerCase()) ){
                        return val;
                    }
                }).map((post) => {
                        return (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={post._id}>
                                <PostPreview
                                    key={post._id}
                                    postID={post._id} 
                                    postTitle={post.title}
                                    postDate={new Date(post.time).toLocaleDateString()}
                                    postTime={new Date(post.time).toLocaleTimeString()}
                                    postUser={post.author.username}
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