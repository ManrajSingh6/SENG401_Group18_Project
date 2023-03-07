import React, { useState, useContext, useEffect } from "react";
import CheckIcon from '@mui/icons-material/Check';
import "./profilePage.css";

import defaultProPic from "../images/defaultUserProPic.png";
import SubbedThreads from "../components/subbedThreads";
import UserPosts from "../components/userPosts";
import {UserContext} from "../context/userContext";

// Dummy data for now
const username = "CarEnthusiast1";
const userEmail = "example@mail.com"
// const userDesc =  "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cume socis natoque penatibus et magnis dis p";

function ProfilePage(){

    const {userInfo} = useContext(UserContext);
    const [userInfoState, setUserInfo] = useState('');

    const [profilePic, setProfilePic] = useState(defaultProPic);
    const [tempProPic, setTempProPic] = useState(null);

    const [userDesc, setUserDesc] = useState('');
    const [tempDesc, setTempDesc] = useState('');

    useEffect(() => {
        fetch(`http://localhost:5000/users/find?username=${userInfo.username}`, {
            credentials: 'include'
        }).then(response => {
            response.json().then(userInfoRes => {
                console.log(userInfoRes);
                setUserInfo(userInfoRes);

                if (userInfoRes.profilePic === "defaultUserProPic.png"){
                    setProfilePic(defaultProPic);
                } else {
                    let imgPath = require(`../../../backend/uploads/${userInfoRes.profilePicture}`);
                    setProfilePic(imgPath);
                }

                setUserDesc(userInfoRes.description);
            })
        })
    }, []);

    function handleChange(){
        // Update user information with backend here
        if (tempDesc !== ''){
            setUserDesc(tempDesc);
        }

        if (tempProPic !== null){
            setProfilePic(tempProPic);
            console.log(tempProPic);
        }
    }

    return(
        <div className="main-profile-container">
            <div className="user-profile-container">
                <div className="user-info">
                {/* Fetch profile picture from  */}
                    <div className="profile-pic-container">
                        <img src={profilePic} alt="user-profile-pic"/>
                    </div>
                    <h2>{userInfo.username}</h2>
                    <p style={{color: "grey", fontSize: "medium", marginTop: "-10px"}}>{userInfoState.email}</p>
                    <div className="user-desc-container">
                        <p>{userDesc}</p>
                    </div>
                </div>

                <div className="edit-profile">
                    <h1>Welcome {userInfoState.username}</h1>
                    <textarea 
                        placeholder="Write a bit about yourself..." 
                        maxLength={120}
                        value={tempDesc}
                        onChange={(ev) => setTempDesc(ev.target.value)}/>
                    <div style={{display: "flex", gap: "20px"}}>
                        <label>Change profile picture: </label>
                        <input type="file" accept="image/*" onChange={(ev) => setTempProPic(ev.target.files)}/>
                    </div>
                    <div onClick={handleChange} className="confirm-button">Confirm <CheckIcon fontSize="small" sx={{marginLeft: "5px"}}/></div>
                </div>
            </div>

            <SubbedThreads />
            <UserPosts />
        </div>
    
    );
}

export default ProfilePage;