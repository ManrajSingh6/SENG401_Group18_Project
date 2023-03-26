import React, {useState, useEffect} from "react";
import "./notificationPage.css";
import { useParams } from "react-router-dom";

import NotificationsIcon from '@mui/icons-material/NotificationsNone';
import Notification from "../components/notification";

function NotificationPage(){

    const {userID} = useParams();
    
    const [allNotifications, setAllNotifications] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/users/allnotifications?userID=${userID}`, {
            credentials: 'include',
        }).then(response => {
            response.json().then(notifications => {
                setAllNotifications(notifications);
            });
        });
    }, []);

    return (
        <div className="notifications-container">
            <div style={{display: "flex", gap: "10px", color:"#004696", justifyContent: "center", alignItems: "center"}}>
                <NotificationsIcon fontSize="large"/>
                <h2>Your Notifications ({allNotifications.length})</h2>
            </div>
            {
                allNotifications.map((notification) => {
                    return (
                        <Notification 
                            dateTime={notification.dateTime}
                            message={notification.notificationMessage}
                            notificationID={notification._id}
                        />
                        
                    );
                })
            }
        </div>
    );
}

export default NotificationPage;