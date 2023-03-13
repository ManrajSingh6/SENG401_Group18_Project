import React, { useState, useEffect } from "react";
import "./homepage.css";
import SearchIcon from '@mui/icons-material/Search';

import Dropdown from "../components/dropdown";
import SmallUserProfile from "../components/SmallUserProfile";

import ironManImgTemp from "../images/ironmanTemp.png";
import ThreadPreview from "../components/threadPreview";
import { Link } from "react-router-dom";

// Temporary Data
const popularThreads = [
    { name: "Food", likes: 25},
    { name: "Cars", likes: 43},
    { name: "Fitness", likes: 98},
    { name: "Health", likes: 17},
    { name: "Fiction", likes: 34}, 
]

const popularUsers = [
    {username: "User1", img: ironManImgTemp, likes: 110},
    {username: "User2", img: ironManImgTemp, likes: 87},
    {username: "User3", img: ironManImgTemp, likes: 34},
    {username: "User4", img: ironManImgTemp, likes: 56},
    {username: "User5", img: ironManImgTemp, likes: 96},
]

export let allThreads = [
    {   threadName: "Cars and Automobiles", 
        userCreated: "carEnthus12", 
        dateCreated: "2023-02-17", timeCreated: "10:59",
        desc: "View new and innovative information about four-wheeled vehicles designed primarily for passenger transportation and commonly propelled by an internal-combustion engine using a volatile fuel.",
        likes: 23,
        comments: 54,
        imgSrc: require("../images/GTRtemp.jpg")
    },
    {   threadName: "Technology", 
        userCreated: "longUserName1", 
        dateCreated: "2023-02-17", timeCreated: "23:42",
        desc: "Technology means a lot of things these days. The word 'technology' brings to mind various devices, such as laptops, phones, and tablets. Technology may also make you think of the internet, data, or advancements in the world of engineering.",
        likes: 36,
        comments: 21,
        imgSrc: require("../images/iphones.png")
    }
];

function Homepage(){

    const [searchQuery, setSearchQuery] = useState('');
    const [tempQuery, setTempQuery] = useState('');
    const [filterChoice, setFilterChoice] = useState('');

    const [allThreads, setAllThreads] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/threads/getallthreads').then(res => {
            res.json().then(threadData => {
                setAllThreads(threadData);
            });
        });
    }, []);
    // Search functionality, add Dropdown functionality
    function handleSearch(event){
        event.preventDefault();
        console.log(searchQuery);
        setSearchQuery(tempQuery);
        setTempQuery('');    
    }

    function handleOptionChange(event){
        console.log(event.target.value)
        setFilterChoice(event.target.value === "" ? "" : event.target.value);
    }

    return(
        <div className="main-container">
            <div className="thread-container">
                <h3>All Threads</h3>
                <div className="form-container">
                    <div className="form-field">
                        <input 
                            type="text" 
                            placeholder="Search by name or user" 
                            className="thread-searchbar"
                            value={tempQuery}
                            onChange={ev => setTempQuery(ev.target.value)} />
                        <div className="search-container" onClick={handleSearch}>
                            <a><SearchIcon style={{color: "#FFFF"}}/></a>
                        </div>
                    </div>
                    <Dropdown selectedOption={filterChoice} onOptionChange={handleOptionChange} className="dropdown" />
                </div>
                
                {/* Map all Available Threads from the database, and handle search functionality (filter) */}
                {allThreads.filter((val) => {
                    if (searchQuery === ""){ return val;} 
                    else if (val.threadname.toLowerCase().includes(searchQuery.toLowerCase()) || val.userCreated.toLowerCase().includes(searchQuery.toLowerCase()) ){
                        return val;
                    }
                }).map((threadItem) => {
                    return (
                        <ThreadPreview
                            key={threadItem._id}
                            threadTitle={threadItem.threadname}
                            userCreated={threadItem.userCreated}
                            dateTimeCreated={threadItem.dateCreated}
                            threadDesc={threadItem.description}
                            likes={threadItem.votes.length}
                            postAmount={threadItem.posts.length}
                            img={threadItem.threadImgUrl}
                        />
                    )
                })}
            </div>

            <div className="sub-container">
                <div className="popular-threads-container">
                    <h3>Popular Threads</h3>
                    {/* Sorting all popular threads by the amount of likes they have */}
                    <ul>
                        {popularThreads.sort((a,b) => (a.likes - b.likes)).reverse()
                        .map((item, index) => {
                            return (<li key={index}><a>{item.name} | <span>{item.likes} likes</span></a></li>)
                        })}
                    </ul>
                </div>
                <div className="popular-users-container">
                    <h3>Users in The Spotlight</h3>
                    <ul className="users-list">
                    {
                        /* Fetch the image src from the DB here */
                        // Sorting popular users by likes before mapping as elements
                        popularUsers.sort((a,b) => (a.likes - b.likes)).reverse().map((user, index) => {
                            return (
                                <li key={index}><SmallUserProfile
                                    imgSrc={user.img} 
                                    name={user.username}
                                    likes={user.likes}/>
                                </li>
                            );
                        })
                    }
                    </ul>
                </div>
            </div>
        
        </div>
    );
}

export default Homepage;