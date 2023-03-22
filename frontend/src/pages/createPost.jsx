import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import "./createPost.css";

import ThreadDropdown from "../components/threadDropdown";
import QuillEditor from "../components/quillEditor";

import { UserContext } from "../context/userContext";

function CreatePostPage(){
    const {userInfo} = useContext(UserContext);
    
    // State mangement for form fields
    const [postTitle, setPostTitle] = useState('');
    const [postSummary, setPostSumary] = useState('');
    const [postContent, setPostContent] = useState('');
    const [postImg, setPostImg] = useState('');
    const [threadChoice, setThreadChoice] = useState('');

    const [newThreadName, setNewThreadName] = useState('');
    const [newThreadSummary, setNewThreadSummary] = useState('');
    const [newThreadImg, setNewThreadImg] = useState('');

    const [isError, setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [redirect, setRedirect] = useState(false);

    function handleOptionChange(event){
        console.log(event.target.value)
        setThreadChoice(event.target.value === "" ? "" : event.target.value);
    }

    // Function to handle new post (and possibly thread) creation
    async function createNewPost(event){
        
        event.preventDefault();
        console.log("Submitted form");

        let threadCreated = false;
        let threadError = false;

        if (newThreadName !== '' && newThreadSummary !== '' && newThreadImg !== ''){

            // Thread Data
            const threadData = new FormData();
            threadData.set('thread_name', newThreadName);
            threadData.set('thread_description', newThreadSummary);
            threadData.set('threadFile', newThreadImg[0]);
            threadData.set('username', userInfo.username);
            
            // Create thread with backend
            const threadResponse = await fetch('http://localhost:5000/threads/create', {
                method: 'POST',
                body: threadData,
                credentials: 'include'
            });

            // Error handling
            if (threadResponse.ok){
                console.log("Successfully created new thread");
                setIsError(false);
                setErrorMsg('');
                threadCreated = true;
                setRedirect(true);
            } else {
                setErrorMsg("Thread name already exists!");
                setIsError(true);
                threadError = true;
                setRedirect(false);
            }
        }
        // If the thread was --> Successfully created OR no new thread was created
        if (!threadError){
            // thread not created and post fields are empty
            if(!threadCreated&&(postTitle === '' || postSummary === '' || postContent === '' || postImg === '' || threadChoice === '')){
                setErrorMsg('All fields must be filled');
                setIsError(true);
                setRedirect(false);
            }
            // post fields not empty
            else if(postTitle !== '' && postSummary !== '' && postContent !== '' && postImg !== '' ){
                // Post Data
                const postData = new FormData();
                postData.set('title', postTitle);
                postData.set('summary', postSummary);
                postData.set('body', postContent);
                if (threadChoice === ''){
                    postData.set('parentThread', newThreadName);
                } else {
                    postData.set('parentThread', threadChoice);
                }
                postData.set('username', userInfo.username);
                postData.set('postFile', postImg[0]);
            
                const postResponse = await fetch('http://localhost:5000/posts/create', {
                    method: 'POST',
                    body: postData,
                    credentials: 'include'
                });
            
                // Error Handling
                if (postResponse.ok){
                    console.log("Successfully created new post");
                    setErrorMsg('');
                    setIsError(false);
                    setRedirect(true);
                } else {
                    setErrorMsg('Post Creation Failed');
                    setIsError(true);
                    setRedirect(false);
                }
            }
        }
        // If post/thread creation is successful, redirect user to homepage
    }
    if (redirect){
        return <Navigate to={'/'} />;
    }

    return(
        <div className="main-form-container">
            <h1 style={{textAlign: "center", fontSize: "1.5rem", fontWeight: "500", color: "#120460"}}>Create A New Post</h1>
            <form onSubmit={createNewPost} id = "post-form" className="post-form">
                <h3 style={{color: "#120460", fontWeight: "400", marginBottom: "5px"}}>What do you want to share?</h3>
                <QuillEditor value={postContent} onChange={setPostContent}/>
                <input 
                    value={postTitle} 
                    type="title" 
                    placeholder="Post Title (80 characters max)" 
                    maxLength={80}
                    onChange={(ev) => {setPostTitle(ev.target.value)}}></input>
                
                <textarea 
                    value={postSummary} 
                    type="title" 
                    placeholder="Post Summary (250 characters max)" 
                    maxLength={250}
                    onChange={(ev) => {setPostSumary(ev.target.value)}}></textarea>

                <p>Choose an image for your post: </p>
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={(ev) => {setPostImg(ev.target.files)}}></input>

                <div className="thread-choice-container">
                    <div>
                        <h3 style={{color: "#120460", fontWeight: "400"}}>Choose a thread to upload post into: </h3>
                        <ThreadDropdown selectedOption={threadChoice} onSelectedOptionChange={handleOptionChange}/>
                    </div>
                    <h4><span>OR</span></h4>
                    <h3 style={{color: "#120460", fontWeight: "400"}}>Create a new thread: </h3>
                    <div className="create-new-thread">
                        <input type="text" 
                            value={newThreadName} 
                            placeholder="Thread name (40 characters max)" 
                            maxLength={40}
                            onChange={(ev) => {setNewThreadName(ev.target.value)}}></input>
                        <textarea type="text" 
                            value={newThreadSummary} 
                            placeholder="Thread summary (200 characters max)" 
                            maxLength={200}
                            onChange={(ev) => {setNewThreadSummary(ev.target.value)}}></textarea>
                        <p>Choose thread image: </p>
                        <input type="file" 
                            accept="image/*"
                            onChange={(ev) => {setNewThreadImg(ev.target.files)}}></input>
                    </div>
                </div>
                <button className="submit-btn">Create Post</button>
            </form>
            {isError ? (<p style={{alignSelf: "center"}}>{errorMsg}</p>) : null}
        </div>
    );
}

export default CreatePostPage;
