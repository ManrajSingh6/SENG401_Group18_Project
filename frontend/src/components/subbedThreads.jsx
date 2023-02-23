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

function SubbedThreads(){
    return(
        <div className="subscribed-threads">
            <h3>Subscribed Threads</h3>
            <Carousel breakPoints={breakpoints} itemPadding={[30, 5]}>
                {
                    allThreads.map((thread, index) => {
                        return (
                        <SubbedThreadCard 
                            key={index} 
                            name={thread.userCreated} 
                            threadName={thread.threadName}
                            date={thread.dateCreated}
                            time={thread.timeCreated}
                            likes={thread.likes}
                            comments={thread.comments}/>
                    )})
                }
            </Carousel>
        </div>
    );
}

export default SubbedThreads;