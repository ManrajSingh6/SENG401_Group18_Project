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

    async function handleLogin(ev){
        ev.preventDefault();
        // Handle authentication here
        console.log(username, password);
        const response = await fetch("http://localhost:5000/users/login", {
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
            });
        } else {
            console.log(response.json());
            setError(true);
        }
    }

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