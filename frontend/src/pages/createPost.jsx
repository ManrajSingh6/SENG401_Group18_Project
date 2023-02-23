import React, { useState } from "react";
import "./createPost.css";

import ThreadDropdown from "../components/threadDropdown";
import QuillEditor from "../components/quillEditor";

function CreatePostPage(){
    
    // State mangement for form fields
    const [postTitle, setPostTitle] = useState('');
    const [postSummary, setPostSumary] = useState('');
    const [postContent, setPostContent] = useState('');
    const [postImg, setPostImg] = useState('');
    const [threadChoice, setThreadChoice] = useState('');

    const [newThreadName, setNewThreadName] = useState('');
    const [newThreadSummary, setNewThreadSummary] = useState('');
    const [newThreadImg, setNewThreadImg] = useState('');

    // Function to handle new post (and possibly thread) creation
    function createNewPost(event){
        event.preventDefault();
        console.log("Submitted form");

        const data = new FormData();
        data.set('postTitle', postTitle);
        data.set('postSummary', postSummary);
        data.set('postContent', postContent);
        data.set('postImg', postImg[0]);

        data.set('newThreadName', newThreadName);
        data.set('newThreadSummary', newThreadSummary);
        data.set('newThreadImg', newThreadImg[0]);

        // Make FETCH backend call here

    }

    return(
        <div className="main-form-container">
            <h1 style={{textAlign: "center", fontSize: "1.5rem", fontWeight: "500", color: "#120460"}}>Create A New Post</h1>
            <form onSubmit={createNewPost} className="post-form">
                <h3 style={{color: "#120460", fontWeight: "400", marginBottom: "5px"}}>What do you want to share?</h3>
                <QuillEditor value={postContent} onChange={setPostContent}/>
                <input required 
                    value={postTitle} 
                    type="title" 
                    placeholder="Post Title (40 characters max)" 
                    maxLength={40}
                    onChange={(ev) => {setPostTitle(ev.target.value)}}></input>
                
                <textarea required 
                    value={postSummary} 
                    type="title" 
                    placeholder="Post Summary (100 characters max)" 
                    maxLength={100}
                    onChange={(ev) => {setPostSumary(ev.target.value)}}></textarea>

                <p>Choose an image for your post: </p>
                <input required 
                    type="file" 
                    accept="image/*"
                    onChange={(ev) => {setPostImg(ev.target.files)}}></input>

                <div className="thread-choice-container">
                    <div>
                        <h3 style={{color: "#120460", fontWeight: "400"}}>Choose a thread to upload post into: </h3>
                        
                        {/* THIS NEEDS TO BE FIXED STILL */}
                        <ThreadDropdown value={threadChoice} onChange={setThreadChoice}/>
                    </div>
                    <h4><span>OR</span></h4>
                    <h3 style={{color: "#120460", fontWeight: "400"}}>Create a new thread: </h3>
                    <div className="create-new-thread">
                        <input type="text" 
                            value={newThreadName} 
                            placeholder="Thread name (40 characters max)" 
                            maxLength={40}
                            onChange={(ev) => {setNewThreadName(ev.target.value)}}></input>
                        <input type="text" 
                            value={newThreadSummary} 
                            placeholder="Thread summary (100 characters max)" 
                            maxLength={100}
                            onChange={(ev) => {setNewThreadSummary(ev.target.value)}}></input>
                        <p>Choose thread image: </p>
                        <input type="file" 
                            accept="image/*"
                            onChange={(ev) => {setNewThreadImg(ev.target.files)}}></input>
                    </div>
                </div>
                <button className="submit-btn">Create Post</button>
            </form>

        </div>
    );
}

export default CreatePostPage;
