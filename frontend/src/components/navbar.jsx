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
    const [isLoggedIn, setLoginStatus] = useState(false);

    // This needs to go into the login/registration progress - not correct currently
    function handleLogin(){
        setLoginStatus(true);
    }

    function handleLogout(){
        setLoginStatus(false);
    }

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
                    <Link to="/create-post" className="nav__link">
                        <li className="nav__item">
                            <AddCircleIcon className="mui-icon"/>
                                Create Post
                        </li>
                    </Link>
                    <Link to="/user-profile" className="nav__link">
                        <li className="nav__item">
                            <AccountCircleIcon className="mui-icon"/>
                                Profile
                        </li>
                    </Link>
                    <Link to="/" className="nav__link">
                        <li className="nav__item" onClick={handleLogout}>
                            <LogoutIcon className="mui-icon"/>
                                Logout ({userName})
                        </li>
                    </Link>
                </>)}
                {!isLoggedIn && (<>
                    <Link to="/login" className="nav__link">
                    <li className="nav__item" onClick={handleLogin}>
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