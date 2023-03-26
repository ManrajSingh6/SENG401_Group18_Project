import React from "react";
import {Routes, Route} from "react-router-dom";
import Layout from "../Layout";
import Homepage from "../pages/homepage";
import LoginPage from "../pages/loginPage";
import RegisterPage from "../pages/registerPage";
import ProfilePage from "../pages/profilePage";
import CreatePostPage from "../pages/createPost";
import PostView from "../pages/postView";
import ThreadPage from "../pages/threadPage";
import EditPost from "../pages/editPost";
import EditThread from "../pages/editThread";
import NotificationPage from "../pages/notificationsPage";
import { UserContextProvider } from "../context/userContext";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App(){
    return (
        <UserContextProvider>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Homepage />} />
                    <Route path={'/create-post'} element={<CreatePostPage />} />
                    <Route path={'/edit-post/:id'} element={<EditPost />} />
                    <Route path={'/edit-thread/:name'} element={<EditThread />} />
                    <Route path={'/login'} element={<LoginPage />} />
                    <Route path={'/register'} element={<RegisterPage />} />
                    <Route path={'/user-profile/:username'} element={<ProfilePage />}/>
                    <Route path={"/:threadName/"} element={<ThreadPage />} />
                    <Route path={"/:threadName/post/:postID"} element={<PostView />} />
                    <Route path={"/notifications/:userID"} element={<NotificationPage />} />
                </Route>
            </Routes>
            <ToastContainer />
        </UserContextProvider>
    );
}

export default App;