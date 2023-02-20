import React from "react";

import "./SmallUserProfile.css";

function SmallUserProfile(props){
    return(
        <div className="user-container">
            <div className="profile-pic">
                <img src={props.imgSrc} alt="profile-img"></img>
            </div>
            <h4>{props.name} | <span>{props.likes} likes</span></h4>
        </div>
    );
}

export default SmallUserProfile;