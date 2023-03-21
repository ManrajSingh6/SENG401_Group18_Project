import React, { useState, useEffect, useContext } from "react";
import "./homepage.css";
import SearchIcon from '@mui/icons-material/Search';

import Dropdown from "../components/dropdown";
import SmallUserProfile from "../components/SmallUserProfile";

import ThreadPreview from "../components/threadPreview";
import { Link } from "react-router-dom";
import { UserContext } from "../context/userContext";


function Homepage(){

    const [searchQuery, setSearchQuery] = useState('');
    const [tempQuery, setTempQuery] = useState('');
    const [filterChoice, setFilterChoice] = useState('');

    const [allThreads, setAllThreads] = useState([]);
    const [popularUsers, setPopularUsers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/threads/getallthreads').then(res => {
            res.json().then(resData => {
                setAllThreads(resData.threads);
                setPopularUsers(resData.users);
            });
        });
    }, []);
    
    function handleSearch(event){
        event.preventDefault();
        setSearchQuery(tempQuery);
        setTempQuery('');    
    }

    function handleOptionChange(event){
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
                            placeholder="Search by thread name or user" 
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
                    else if (val.threadname.toLowerCase().includes(searchQuery.toLowerCase()) || val.userCreated.username.toLowerCase().includes(searchQuery.toLowerCase()) ){
                        return val;
                    }
                }).map((threadItem) => {
                    return (
                        <ThreadPreview
                            key={threadItem._id}
                            threadID={threadItem._id}
                            threadTitle={threadItem.threadname}
                            userCreated={threadItem.userCreated.username}
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
                        {allThreads.sort((a,b) => (a.votes.length - b.votes.length)).reverse()
                        .map((item, index) => {
                            return (<Link className="pop-thread-link" to={`/${item.threadname}`}><li key={index}>{item.threadname} 🞄 <span>{item.votes.length} likes</span></li></Link>)
                        })}
                    </ul>
                </div>
                <div className="popular-users-container">
                    <h3>Users in The Spotlight</h3>
                    <ul className="users-list">
                    {
                        // Sorting popular users by posts before mapping as elements
                        popularUsers.sort((a,b) => (a.posts.length - b.posts.length)).reverse().map((user, index) => {
                            return (
                                <li key={index}>
                                    <SmallUserProfile
                                        imgSrc={user.profilePicture === "defaultUserProPic.png" ? (require("../images/defaultUserProPic.png")) : ('http://localhost:5000/' + user.profilePicture)}
                                        name={user.username}
                                        likes={user.posts.length}/>
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