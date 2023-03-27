import React, {useContext, useState, useEffect} from "react";
import QuillEditor from "../components/quillEditor";
import { UserContext } from "../context/userContext";
import { Navigate, useParams } from "react-router-dom";

function EditPost() {
    const {userInfo} = useContext(UserContext);
    const {id} = useParams();
    
    // State mangement for form fields
    const [postTitle, setPostTitle] = useState('');
    const [postSummary, setPostSumary] = useState('');
    const [postContent, setPostContent] = useState('');
    const [postImg, setPostImg] = useState('');
    const [parentThread, setParentThread] = useState('');

    const [isError, setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [redirect, setRedirect] = useState(false);

    // Get previous post data and update the form fields
    useEffect(() => {
        fetch(`http://localhost:5000/posts/find?post_id=${id}`)
        .then(res => {
            res.json().then(postInfo => {
                setPostTitle(postInfo.Post.title);
                setPostSumary(postInfo.Post.summary);
                setPostContent(postInfo.Post.body);
                setParentThread(postInfo.Post.thread.threadname);
            });
        });
    }, []);

    // Function to handle updating posts
    async function updatePost(event){
        event.preventDefault();
        // Post Data
        const postData = new FormData();
        postData.set('title', postTitle);
        postData.set('summary', postSummary);
        postData.set('body', postContent);
        postData.set('username', userInfo.username);
        postData.set('postFile', postImg[0]);
        postData.set('postID', id);
        
        const postResponse = await fetch('http://localhost:5000/posts/update', {
            method: 'PUT',
            body: postData,
            credentials: 'include'
        });
        
        // Error Handling
        if (postResponse.ok){
            setErrorMsg('');
            setIsError(false);
            setRedirect(true);
        } else {
            setErrorMsg('Error editing post.');
            setIsError(true);
        }
    }

    // If successful change, redirect the user
    if (redirect){
        return <Navigate to={`/${parentThread}/post/${id}`} />;
    }

    return(
        <div className="main-form-container">
            <h1 style={{textAlign: "center", fontSize: "1.5rem", fontWeight: "500", color: "#120460"}}>Edit Your Post</h1>
            <form onSubmit={updatePost} className="post-form">
                <h3 style={{color: "#120460", fontWeight: "400", marginBottom: "5px"}}>What changes do you want to make?</h3>
                <QuillEditor value={postContent} onChange={setPostContent}/>
                <input required 
                    value={postTitle} 
                    type="title" 
                    placeholder="Post Title (80 characters max)" 
                    maxLength={80}
                    onChange={(ev) => {setPostTitle(ev.target.value)}}></input>
                <textarea required 
                    value={postSummary} 
                    type="title" 
                    placeholder="Post Summary (250 characters max)" 
                    maxLength={250}
                    onChange={(ev) => {setPostSumary(ev.target.value)}}></textarea>
                <p>Change your post image: </p>
                <input
                    type="file" 
                    accept="image/*"
                    onChange={(ev) => {setPostImg(ev.target.files)}}></input>
                <button className="submit-btn">Update Post</button>
            </form>
            {isError ? (<p style={{alignSelf: "center"}}>{errorMsg}</p>) : null}
        </div>
    );
}

export default EditPost;