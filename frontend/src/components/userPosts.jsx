import React from "react";
import "./subbedThreads.css";

import Carousel from 'react-elastic-carousel';
import UserPostCard from "./userPostCard";

// Breakpoint for carousel
const breakpoints = [
    {width: 1, itemsToShow: 1},
    {width: 500, itemsToShow: 2},
    {width: 768, itemsToShow: 3},
    {width: 1200, itemsToShow: 4},
]

function UserPosts(props){
    return(
        <div className="subscribed-threads">
            <h3 style={{marginBottom: "40px"}}>Your Posts</h3>
            <Carousel breakPoints={breakpoints} itemPadding={[30, 5]}>
                {
                    props.userPosts.map((post) => {
                        return (
                        <UserPostCard 
                            key={post._id}
                            postID={post._id}
                            postName={post.title}
                            dateCreated={post.time}
                            timeCreated={post.time}
                            postLikes={post.votes.length}
                            postComments={post.comments.length}
                            parentThread={post.thread.threadname} />
                    )})
                }
            </Carousel>
        </div>
    );
}

export default UserPosts;