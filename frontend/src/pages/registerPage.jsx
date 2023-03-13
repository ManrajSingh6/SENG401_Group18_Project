import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import "../pages/loginRegister.css";

function RegisterPage(){
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [dupePass, setDupePass] = useState('');
    const [redirect, setRedirect] = useState(false);

    const [isError, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    // Can do further authentication
    async function handleRegister(ev){
        ev.preventDefault();

        // If passwords match, continue with registration
        if (password === dupePass){
            const response = await fetch("http://localhost:5000/users/register", {
                method: 'POST',
                body: JSON.stringify({email, username, password}),
                headers: {'Content-Type':'application/json'}
            });

            // If Valid response, redirect and display no error messages else display appropriate error message
            if (response.ok){
                setError(false);
                setErrorMessage(null);
                setRedirect(true);
            } else {
                setError(true);
                setErrorMessage("Username is taken!")
            }
        } else {
            setError(true);
            setErrorMessage("Passwords don't match!")
        }
    }

    if (redirect){
        return <Navigate to={'/login'} />
    }

    return(
        <div className="main-signup-container">
            <div className="sub-container1">
            <form onSubmit={handleRegister}>
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
                    <button className="login-btn">Sign up</button>
                    <p>Already have an account?<Link to="/login">Login here</Link></p>
                    {isError ? (<p>{errorMessage}</p>) : null}
            </form>  
            </div>
        </div>
    );
}

export default RegisterPage;