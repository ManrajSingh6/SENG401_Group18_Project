import React from "react";
import "./subbedThreads.css";


import SubbedThreadCard from "./subThreadCard";
import Carousel from 'react-elastic-carousel';

// Temporary data delete this later
import { allThreads } from "../pages/homepage";



// Breakpoint for carousel
const breakpoints = [
    {width: 1, itemsToShow: 1},
    {width: 500, itemsToShow: 2},
    {width: 768, itemsToShow: 3},
    {width: 1200, itemsToShow: 4},
]

function SubbedThreads(props){
    return(
        <div className="subscribed-threads">
            <h3 style={{marginBottom: "40px"}}>Subscribed Threads</h3>
            <Carousel breakPoints={breakpoints} itemPadding={[30, 5]}>
                {
                    props.subbedThreads.map((thread) => {
                        return (
                        <SubbedThreadCard 
                            key={thread._id} 
                            name={thread.userCreated.username} 
                            threadName={thread.threadname}
                            date={thread.dateCreated}
                            time={thread.dateCreated}
                            likes={thread.votes.length}
                            comments={thread.posts.length}/>
                    )})
                }
            </Carousel>
        </div>
    );
}

export default SubbedThreads;