import React, {useState} from "react";
import { Link } from "react-router-dom";
import "./navbar.css"

import theLoopLogo from "../images/theloopLogo.png";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import AddCircleIcon from '@mui/icons-material/AddCircle';

function Navbar(){
    const userName = "demoUserName";
    const isLoggedIn = true;

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
                {isLoggedIn && (<>
                    <li className="nav__item">
                        <Link to="/create-post" className="nav__link">
                        <AddCircleIcon className="mui-icon"/>
                            Create Post
                        </Link>
                    </li>
                    <li className="nav__item">
                        <Link to="/user-profile" className="nav__link">
                        <AccountCircleIcon className="mui-icon"/>
                            Profile
                        </Link>
                    </li>
                    <li className="nav__item">
                        <Link to="/" className="nav__link">
                        <LogoutIcon className="mui-icon"/>
                            Logout ({userName})
                        </Link>
                    </li>
                </>)}
                {!isLoggedIn && (<>
                    <li className="nav__item">
                        <Link to="/login-register" className="nav__link">
                        <LoginIcon className="mui-icon"/>
                            Login/Register
                        </Link>
                    </li>
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