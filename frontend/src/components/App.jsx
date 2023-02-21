import React from "react";
import {Routes, Route} from "react-router-dom";
import Layout from "../Layout";
import Homepage from "../pages/homepage";
import LoginPage from "../pages/loginPage";
import RegisterPage from "../pages/registerPage";

function App(){
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Homepage />} />
                <Route path={'/create-post'} element={<div>Create Post Page</div>} />
                <Route path={'/login'} element={<LoginPage />} />
                <Route path={'/register'} element={<RegisterPage />} />
                <Route path={'/user-profile'} element={<div>User Dashboard</div>}/>
            </Route>
        </Routes>
    );
}

export default App;