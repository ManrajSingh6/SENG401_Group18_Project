import React, {useContext, useState, useEffect} from "react";
import { Link } from "react-router-dom";
import "./navbar.css"
import { UserContext } from "../context/userContext";

import theLoopLogo from "../images/theloopLogo.png";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

function Navbar(){

    const {userInfo, setUserInfo} = useContext(UserContext);

    useEffect(() => {
        fetch('http://localhost:5000/users/verifyprofile', {
            credentials: 'include',
        }).then(response => {
            response.json().then(tempUserInfo => {
                setUserInfo(tempUserInfo);
            });
        });
    }, []);

    function handleLogout(){
        fetch("http://localhost:5000/users/logout", {
            credentials: 'include',
            method: 'POST',
        });
        setUserInfo(null);
    }

    const username = userInfo?.username;

    // Responsiveness
    const [active, setActive] = useState("nav__menu");
    const [icon, setIcon] = useState("nav__toggler");
    const navToggle = () => {
        if (active === "nav__menu") {
            setActive("nav__menu nav__active");
        } else setActive("nav__menu");

        // Icon Toggler
        if (icon === "nav__toggler") {
            setIcon("nav__toggler toggle");
        } else setIcon("nav__toggler");
    };
    
    return (
        <nav className="nav">
            <div className="logo-container">
                <Link to="/">
                    <img src={theLoopLogo} alt="logo-img"></img>
                </Link>
            </div>
            <ul className={active}>
                {username && (<>
                    <Link to="/create-post" className="nav__link">
                        <li className="nav__item">
                            <AddCircleIcon className="mui-icon"/>
                                Create Post
                        </li>
                    </Link>
                    <Link to={`/notifications/${userInfo.id}`} className="nav__link">
                        <li className="nav__item">
                            <NotificationsActiveIcon className="mui-icon"/>
                                Notifications
                        </li>
                    </Link>
                    <Link to={`/user-profile/${username}`} className="nav__link">
                        <li className="nav__item">
                            <AccountCircleIcon className="mui-icon"/>
                                Profile
                        </li>
                    </Link>
                    <Link to="/" className="nav__link">
                        <li className="nav__item" onClick={handleLogout}>
                            <LogoutIcon className="mui-icon"/>
                                Logout ({username})
                        </li>
                    </Link>
                </>)}
                {!username && (<>
                    <Link to="/login" className="nav__link">
                    <li className="nav__item">
                        <LoginIcon className="mui-icon"/>
                            Login/Register
                    </li>
                    </Link>
                </>)}
            </ul>
            <div onClick={navToggle} className={icon}>
                <div className="line1"></div>
                <div className="line2"></div>
                <div className="line3"></div>
            </div>
        </nav>
    );
}

export default Navbar;