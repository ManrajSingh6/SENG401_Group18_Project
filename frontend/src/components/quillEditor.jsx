import React from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function QuillEditor({value, onChange}){

    // React Quill Editor Modules
    const modules = {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
          ],
          ['link'],
          ['clean'],
        ],
    };

    return(
        <div className="content-container">
            <ReactQuill theme="snow" 
                modules={modules} 
                className="editor" 
                onChange={onChange} 
                value={value}/>
        </div>
    );

}

export default QuillEditor;