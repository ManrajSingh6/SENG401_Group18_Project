import React, { useState, useEffect } from "react";
import CheckIcon from '@mui/icons-material/Check';
import "./profilePage.css";

import defaultProPic from "../images/defaultUserProPic.png";
import SubbedThreads from "../components/subbedThreads";
import UserPosts from "../components/userPosts";
import UserThreads from "../components/userThreads";
// React Toast Notifications
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Confirm popup
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

function ProfilePage(){
    
    const [userInfoState, setUserInfo] = useState('');
    const [userPosts, setUserPosts] = useState([]);
    const [subbedThreads, setSubbedThreads] = useState([]);
    const [userThreads, setUserThreads] = useState([]);

    const [isError, setIsError] = useState(false);

    const [files, setFiles] = useState('');

    const [userDesc, setUserDesc] = useState('');
    const [tempDesc, setTempDesc] = useState('');

    const splitString = window.location.href.split("/");
    const userName = splitString[splitString.length - 1];

    useEffect(() => {
        fetch(`http://localhost:5000/users/find?username=${userName}`, {
            credentials: 'include'
        }).then(response => {
            response.json().then(userInfoRes => {
                setUserDesc(userInfoRes.User.description); 
                setUserInfo(userInfoRes.User);
                setSubbedThreads(userInfoRes.subscribedThreads);
                setUserPosts(userInfoRes.userPosts);
                setUserThreads(userInfoRes.createdThreads)
                
            });
        })
    }, []);

    async function handleChange(){
        // Update user information with backend and display updated information to frontend
        const data = new FormData();
        data.set('newDesc', tempDesc);
        data.set('username', userName);
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
    async function deleteUser(){
        await fetch('http://localhost:5000/users/logout', {
            method: 'POST',
            body: JSON.stringify({}),
            headers: {'Content-Type':'application/json'},
            credentials: 'include',
        });

        const response = await fetch('http://localhost:5000/users/remove', {
            method: 'POST',
            body: JSON.stringify({username: userInfoState.username}),
            headers: {'Content-Type':'application/json'},
            credentials: 'include',
        });

        if (response.ok){
            console.log("Succesfully deleted user");
            window.location.assign('/');
        } else {
            toast.error("Unable to delete account.");
        }
    }

    function confirmDeletion(){
        confirmAlert({
            customUI: ({onClose}) => {
                return (
                    <div className="custom-ui">
                        <h2>Confirm deletion.</h2>
                        <p>Are you sure you want to do this? This action cannot be undone.</p>
                        <button onClick={() => {deleteUser(); onClose();}}>Yes</button>
                        <button onClick={onClose}>No</button>
                    </div>
                );
            }
        });
    }
    
    return(
        <div className="main-profile-container">
            <div className="user-profile-container">
                <div className="user-info">
                    <div className="profile-pic-container">
                        <img src={userInfoState.profilePicture === 'defaultUserProPic.png' ? (defaultProPic): 'http://localhost:5000/' + userInfoState.profilePicture} alt="user-profile-pic"/>
                    </div>
                    <h2>{userInfoState.username}</h2>
                    <p style={{color: "grey", fontSize: "medium", marginTop: "-10px"}}>{userInfoState.email}</p>
                    <div className="user-desc-container">
                        <p>{userDesc}</p>
                    </div>
                    <p onClick={confirmDeletion} role="button" className="post-option-btn" style={{color: "red"}}>Delete Account</p>
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

            <SubbedThreads subbedThreads={subbedThreads}/>
            <UserThreads userThreads={userThreads}/>
            <UserPosts userPosts={userPosts}/>
        </div>
    );
}

export default ProfilePage;