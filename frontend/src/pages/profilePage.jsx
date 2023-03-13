import React, { useState, useContext, useEffect } from "react";
import CheckIcon from '@mui/icons-material/Check';
import "./profilePage.css";

import defaultProPic from "../images/defaultUserProPic.png";
import SubbedThreads from "../components/subbedThreads";
import UserPosts from "../components/userPosts";
import {UserContext} from "../context/userContext";


function ProfilePage(){

    const {userInfo} = useContext(UserContext);
    const [userInfoState, setUserInfo] = useState('');

    const [isError, setIsError] = useState(false);

    const [files, setFiles] = useState('');

    const [userDesc, setUserDesc] = useState('');
    const [tempDesc, setTempDesc] = useState('');

    useEffect(() => {
        fetch(`http://localhost:5000/users/find?username=${userInfo.username}`, {
            credentials: 'include'
        }).then(response => {
            response.json().then(userInfoRes => {
                setUserDesc(userInfoRes.description); 
                setUserInfo(userInfoRes);
            })
        })
    }, []);

    async function handleChange(){
        // Update user information with backend and display updated information to frontend
        const data = new FormData();
        data.set('newDesc', tempDesc);
        data.set('username', userInfo.username);
        if (files?.[0]){
            data.set('file', files?.[0]);
        }

        const response = await fetch ('http://localhost:5000/users/updateprofile', {
            method: 'PUT',
            body: data,
            credentials: 'include'
        });

        if (response.ok){
            response.json().then(data => {
                setUserDesc(data.description); 
                setUserInfo(data);
            });
            setIsError(false);
            setTempDesc('');
        } else {
            setIsError(true);
        }
    }

    return(
        <div className="main-profile-container">
            <div className="user-profile-container">
                <div className="user-info">
                    <div className="profile-pic-container">
                        <img src={userInfoState.profilePicture === 'defaultUserProPic.png' ? (defaultProPic): 'http://localhost:5000/' + userInfoState.profilePicture} alt="user-profile-pic"/>
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
                        maxLength={200}
                        value={tempDesc}
                        onChange={(ev) => setTempDesc(ev.target.value)}/>
                    <div style={{display: "flex", gap: "20px"}}>
                        <label>Change profile picture: </label>
                        <input type="file" accept="image/*" onChange={(ev) => setFiles(ev.target.files)}/>
                    </div>
                    <div onClick={handleChange} className="confirm-button">Confirm <CheckIcon fontSize="small" sx={{marginLeft: "5px"}}/></div>
                    {isError ? (<p>Error updating user information.</p>) : null}
                </div>
            </div>

            <SubbedThreads />
            <UserPosts />
        </div>
    
    );
}

export default ProfilePage;