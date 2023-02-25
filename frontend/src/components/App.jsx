import React from "react";
import {Routes, Route} from "react-router-dom";
import Layout from "../Layout";
import Homepage from "../pages/homepage";
import LoginPage from "../pages/loginPage";
import RegisterPage from "../pages/registerPage";
import ProfilePage from "../pages/profilePage";
import CreatePostPage from "../pages/createPost";
import PostView from "../pages/postView";

function App(){
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Homepage />} />
                <Route path={'/create-post'} element={<CreatePostPage />} />
                <Route path={'/login'} element={<LoginPage />} />
                <Route path={'/register'} element={<RegisterPage />} />
                <Route path={'/user-profile'} element={<ProfilePage />}/>
                <Route path={"/:threadName/"} element={<div>ThreadPage</div>} />
                <Route path={"/post"} element={<PostView />} />
            </Route>
        </Routes>
    );
}

export default App;