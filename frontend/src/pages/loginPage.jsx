import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

import "./loginRegister.css";

function LoginPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    const [isError, setError] = useState(false);

    const {setUserInfo} = useContext(UserContext);

    // Handle login function
    async function handleLogin(ev){
        ev.preventDefault();
        // Handle authentication here
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-Type' : 'application/json'},
            credentials: 'include'
        });

        if (response.ok){
            response.json().then(tempUserInfo => {
                setError(false);
                setUserInfo(tempUserInfo);
                setRedirect(true);
                window.localStorage.setItem('UserInfoUsername', tempUserInfo.username);
                window.localStorage.setItem('UserInfoID', tempUserInfo.id);
                window.localStorage.setItem('isLoggedIn', true);                
            });
        } else {
            setError(true);
        }
    }

    // if valid login, redirect to homepage
    if (redirect){
        return <Navigate to={'/'} />
    }

    return(
        <div className="main-signup-container">
            <div className="sub-container1">
                <form onSubmit={handleLogin}>
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
                    <button className="login-btn">Login</button>
                    <p>Don't have an account?<Link to="/register">Sign up here</Link></p>
                    {isError ? (<p>Username or Password is incorrect!</p>) : null}
                </form>
            </div>
        </div>
    );
}

export default LoginPage;