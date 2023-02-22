import React, { useState } from "react";
import CheckIcon from '@mui/icons-material/Check';
import "./profilePage.css";

import profilePic from "../images/GTRtemp.jpg";
import defaultProPic from "../images/defaultUserProPic.png";

// Dummy data for now
const username = "CarEnthusiast1";
const userEmail = "example@mail.com"
// const userDesc =  "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cume socis natoque penatibus et magnis dis p";

function ProfilePage(){

    const [profilePic, setProfilePic] = useState(defaultProPic);
    const [tempProPic, setTempProPic] = useState(null);

    const [userDesc, setUserDesc] = useState('You have yet to add a description.');
    const [tempDesc, setTempDesc] = useState('');

    function handleChange(){
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
                    <div className="profile-pic-container">
                        <img src={profilePic} alt="user-profile-pic"/>
                    </div>
                    <h2>{username}</h2>
                    <p style={{color: "grey", fontSize: "medium", marginTop: "-10px"}}>{userEmail}</p>
                    <div className="user-desc-container">
                        <p>{userDesc}</p>
                    </div>
                </div>

                <div className="edit-profile">
                    <h1>Welcome {username}</h1>
                    <textarea 
                        placeholder="Write a bit about yourself..." 
                        maxLength={150}
                        value={tempDesc}
                        onChange={(ev) => setTempDesc(ev.target.value)}/>
                    <div style={{display: "flex", gap: "20px"}}>
                        <label>Change profile picture: </label>
                        <input type="file" accept="image/*" onChange={(ev) => setTempProPic(ev.target.files)}/>
                    </div>
                    <div onClick={handleChange} className="confirm-button">Confirm <CheckIcon fontSize="small" sx={{marginLeft: "5px"}}/></div>
                </div>
            </div>

            
        
        </div>
    
    );
}

export default ProfilePage;