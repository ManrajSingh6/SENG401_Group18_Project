import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../pages/loginRegister.css";

function RegisterPage(){
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [dupePass, setDupePass] = useState('');

    // Can do further autehnti
    function handleSubmit(ev){
        ev.preventDefault();
        if (password === dupePass){
            console.log("match");

            // Handle authentication with backend here
        } else {
            // If passwords don't match, don't authenticate
            console.log("No Match")
        }
    }

    return(
        <div className="main-signup-container">
            <div className="sub-container1">
                <h1>Register</h1>
                <div className="input-container">
                    <input type="email" 
                           placeholder="Email" 
                           value={email}
                           onChange={(ev) => setEmail(ev.target.value)}
                           required/>
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
                    <input type="password" 
                           placeholder="Re-enter password" 
                           value={dupePass}
                           onChange={(ev) => setDupePass(ev.target.value)}
                           required/>
                </div>
                <div className="login-btn" onClick={handleSubmit}>Sign up</div>
                <p>Already have an account?<Link to="/login">Login here</Link></p>
            </div>
        </div>
    );
}

export default RegisterPage;