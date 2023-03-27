import React from "react";
import "../pages/notificationPage.css";

import CloseIcon from '@mui/icons-material/Close';
import { useParams } from "react-router-dom";

// Toast Notifications
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Notification(props){

    const {userID} = useParams();

    async function acknowledgeNotification(){
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/acknowledgenotification`, {
            method: 'POST',
            body: JSON.stringify({userID, notificationID: props.notificationID}),
            headers: {'Content-Type':'application/json'},
        });

        if (response.ok){
            window.location.reload();
        } else {
            toast.error('Unable to delete notification.');
        }
    }

    return (
        <div className="main-noti-container">
            <div className="notification">
                <p>{new Date(props.dateTime).toLocaleDateString()} • {new Date(props.dateTime).toLocaleTimeString()}</p>
                <p>{props.message}</p>
            </div>
            <CloseIcon className="cancel-icon" onClick={acknowledgeNotification}/>
        </div>
    );
}

export default Notification;