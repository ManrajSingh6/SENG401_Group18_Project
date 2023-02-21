import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./loginRegister.css";

function LoginPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit(ev){
        ev.preventDefault();
        // Handle authentication here
    }

    return(
        <div className="main-signup-container">
            <div className="sub-container1">
                <h1>Login</h1>
                <div className="input-container">
                    <input type="text" 
                           placeholder="Username" 
                           value={username}
                           onChange={(ev) => setUsername(ev.target.value)}
                           required/>
                    <input type="password" 
                           placeholder="Password" 
                           value={password}
                           onChange={(ev) => setPassword(ev.target.value)}
                           required/>
                </div>
                <div className="login-btn" onClick={handleSubmit}>Login</div>
                <p>Don't have an account?<Link to="/register">Sign up here</Link></p>
            </div>
        </div>
    );
}

export default LoginPage;