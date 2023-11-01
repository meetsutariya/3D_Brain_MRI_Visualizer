import React, { useState } from "react";
import { useNavigate } from "react-router-dom";



const FileUploader = ({ setUploadedFile }) => {

  const navigate = useNavigate();

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setUploadedFile(selectedFile);
   
      // window.localStorage.setItem("niiFilestackoverflow",$.toJSON(selectedFile));
      navigate("/visualization");
    }
    else
    {
       alert('Please upload file')
    }
  };

  

  

  // below is temp code:
  var isAdvancedUpload = function() {
    var div = document.createElement('div');
    return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
  }();
  
  // let draggableFileArea = document.querySelector(".drag-file-area");
  // let browseFileText = document.querySelector(".browse-files");
  // let uploadIcon = document.querySelector(".upload-icon");
  // let dragDropText = document.querySelector(".dynamic-message");
  // let fileInput = document.querySelector(".default-file-input");
  // let cannotUploadMessage = document.querySelector(".cannot-upload-message");
  // let cancelAlertButton = document.querySelector(".cancel-alert-button");
  // let uploadedFile = document.querySelector(".file-block");
  // let fileName = document.querySelector(".file-name");
  // let fileSize = document.querySelector(".file-size");
  // let progressBar = document.querySelector(".progress-bar");
  // let removeFileButton = document.querySelector(".remove-file-icon");
  // let uploadButton = document.querySelector(".upload-button");
  // let fileFlag = 0;
  

  return (
    // <div className="customeFileUploader">
    //   <h1>Upload NII File</h1>

    //   <input className="fileInput" type="file" id='files' onChange={handleChange}/>
    // </div>

    
    
    <form className="form-container" enctype='multipart/form-data'>
      <div className="upload-files-container">
        <div className="drag-file-area">
          <span className="material-icons-outlined upload-icon"> file_upload </span>
          <h3 className="dynamic-message"> Drag & drop any file here </h3>
          <label className="label"> or <span className="browse-files"> <input type="file" className="default-file-input" onChange={handleChange}/> <span className="browse-files-text">browse file</span> <span>from device</span> </span> </label>
        </div>
        <span className="cannot-upload-message"> <span className="material-icons-outlined">error</span> Please select a file first <span className="material-icons-outlined cancel-alert-button">cancel</span> </span>
        <div className="file-block">
          <div className="file-info"> <span className="material-icons-outlined file-icon">description</span> <span className="file-name"> </span> | <span className="file-size">  </span> </div>
          <span className="material-icons remove-file-icon">delete</span>
          <div className="progress-bar"> </div>
        </div>
        <button type="button" className="upload-button" onClick={handleChange}> Upload </button>
      </div>
  </form>

  
  );
};

export default FileUploader;

// // export default function FileUploader() {
// const FileUploader = () => {

//     const [file, setFile] = useState(null);
//     const navigate = useNavigate();
  
//     const handleChange = (e) => {
//       const selectedFile = e.target.files[0];
//       if (selectedFile) {
//         // console.log(selectedFile)
//         setFile(selectedFile);
//         const reader = new FileReader();
//         reader.readAsArrayBuffer(selectedFile);
//         reader.onload = function () {
//           const arrayBuffer = reader.result;

//           const byteLength = arrayBuffer.byteLength;

//           let newBuffer;

//             // Check if byteLength is a multiple of 2
//             if (byteLength % 2 !== 0) {
//             // Create a new buffer with an extra byte
//             newBuffer = new ArrayBuffer(byteLength + 1);
//             new Uint8Array(newBuffer).set(new Uint8Array(arrayBuffer));
//             // Use newBuffer in place of arrayBuffer for your Uint16Array
//             }
//           localStorage.setItem("niiFile", newBuffer);
//           console.log(newBuffer)
//           navigate("/visualization");
//         };
//       }
//     };

//   return (
//     <div>
//       <h1>Upload NII File</h1>
//       <input type="file" onChange={handleChange} />
//       {file && <p>Selected file: {file.name}</p>}
//     </div>
//   );
// }



// // const FileUploader = () => {
// //   const [file, setFile] = useState(null);
// //   const navigate = useNavigate();

// //   const handleChange = (e) => {
// //     const selectedFile = e.target.files[0];
// //     if (selectedFile) {
// //       setFile(selectedFile);
// //       const reader = new FileReader();
// //       reader.readAsArrayBuffer(selectedFile);
// //       reader.onload = function () {
// //         const arrayBuffer = reader.result;
// //         localStorage.setItem("niiFile", arrayBuffer);
// //         navigate("/visualization");
// //       };
// //     }
// //   };

// //   return (
// //     <div>
// //       <h1 style={{color:"white"}}>Upload NII File</h1>
// //       <input type="file" onChange={handleChange} />
// //       {file && <p>Selected file: {file.name}</p>}
// //     </div>
// //   );
// // };

// export default FileUploader;
