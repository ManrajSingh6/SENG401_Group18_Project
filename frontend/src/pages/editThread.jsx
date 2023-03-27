import React, {useContext, useState, useEffect} from "react";
import { UserContext } from "../context/userContext";
import { Navigate, useParams } from "react-router-dom";

function EditThread() {
    const {userInfo} = useContext(UserContext);
    const {name} = useParams();
    
    // State mangement for form fields
    const [threadDescription, setThreadDesc] = useState('');
    const [threadImg, setThreadImg] = useState('');

    const [isError, setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [redirect, setRedirect] = useState(false);

    // Get previously filled form data and change values in edit post form
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/posts/find?thread_name=${name}`)
        .then(res => {
            res.json().then(threadInfo => {
                setThreadDesc(threadInfo.description);
            });
        });
    }, []);

    // Function to handle updating posts
    async function updateThread(event){
        event.preventDefault();
        // Post Data
        const threadData = new FormData();
        threadData.set('description', threadDescription);
        threadData.set('username', userInfo.username);
        threadData.set('threadFile', threadImg[0]);
        threadData.set('threadname', name);
        
        const threadResponse = await fetch(`${process.env.REACT_APP_API_URL}/threads/update`, {
            method: 'PUT',
            body: threadData,
            credentials: 'include'
        });
        
        // Error Handling
        if (threadResponse.ok){
            setErrorMsg('');
            setIsError(false);
            setRedirect(true);
        } else {
            setErrorMsg('Error editing thread.');
            setIsError(true);
        }
    }

    // If sucessfully changed post data, redirect user
    if (redirect){
        return <Navigate to={`/${name}`} />;
    }

    return(
        <div className="main-form-container">
            <h1 style={{textAlign: "center", fontSize: "1.5rem", fontWeight: "500", color: "#120460"}}>Edit Your Post</h1>
            <form onSubmit={updateThread} className="post-form">
                <h3 style={{color: "#120460", fontWeight: "400", marginBottom: "5px"}}>What changes do you want to make?</h3>
                <textarea required 
                    value={threadDescription} 
                    type="title" 
                    placeholder="Thread Description (200 characters max)" 
                    maxLength={200}
                    onChange={(ev) => {setThreadDesc(ev.target.value)}}></textarea>
                <p>Change your thread image: </p>
                <input
                    type="file" 
                    accept="image/*"
                    onChange={(ev) => {setThreadImg(ev.target.files)}}></input>
                <button className="submit-btn">Update Thread</button>
            </form>
            {isError ? (<p style={{alignSelf: "center"}}>{errorMsg}</p>) : null}
        </div>
    );
}

export default EditThread;