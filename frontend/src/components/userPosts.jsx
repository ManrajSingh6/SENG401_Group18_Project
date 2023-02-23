import React from "react";
import "./subbedThreads.css";

import SubbedThreadCard from "./subThreadCard";
import Carousel from 'react-elastic-carousel';
import UserPostCard from "./userPostCard";

// Temporary data delete this later
const userPosts = [
    {postName: "Post1", dateCreated: "2023-02-17", timeCreated: "10:59", postLikes: 30, postComments: 21, parentThread: "Cars"},
    {postName: "Post2", dateCreated: "2023-02-17", timeCreated: "10:59", postLikes: 30, postComments: 21, parentThread: "Technology"},
    {postName: "Post3", dateCreated: "2023-02-17", timeCreated: "10:59", postLikes: 30, postComments: 21, parentThread: "Food"},
    {postName: "Post4", dateCreated: "2023-02-17", timeCreated: "10:59", postLikes: 30, postComments: 21, parentThread: "Health"},
]

// Breakpoint for carousel
const breakpoints = [
    {width: 1, itemsToShow: 1},
    {width: 500, itemsToShow: 2},
    {width: 768, itemsToShow: 3},
    {width: 1200, itemsToShow: 4},
]

function UserPosts(){
    return(
        <div className="subscribed-threads">
            <h3>Your Posts</h3>
            <Carousel breakPoints={breakpoints} itemPadding={[30, 5]}>
                {
                    userPosts.map((post, index) => {
                        return (
                        <UserPostCard 
                            key={index}
                            postName={post.postName}
                            dateCreated={post.dateCreated}
                            timeCreated={post.timeCreated}
                            postLikes={post.postLikes}
                            postComments={post.postComments}
                            parentThread={post.parentThread} />
                    )})
                }
            </Carousel>
        </div>
    );
}

export default UserPosts;