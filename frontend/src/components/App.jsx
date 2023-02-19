import React from "react";
import {Routes, Route} from "react-router-dom";
import Layout from "../Layout";

function App(){
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path={'/create-post'} element={<div>Create Post Page</div>} />
                <Route path={'/login-register'} element={<div>Login Register Page</div>}/>
                <Route path={'/user-profile'} element={<div>User Dashboard</div>}/>
            </Route>
        </Routes>
        
    );
}

export default App;