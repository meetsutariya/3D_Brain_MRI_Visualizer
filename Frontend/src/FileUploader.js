import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FileUploader = ({ setUploadedFile }) => {
  const [file, setFile] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleChange = () => {
    if (file) {
      setUploadedFile(file);
      navigate("/visualization");
    } else {
      setShowAlert(true);
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  return (
    <form
      className="form-container"
      encType="multipart/form-data"
      onDrop={handleFileDrop}
      onDragOver={handleDragOver}
    >
      <div className="upload-files-container">
        <div className="drag-file-area">
          <span className="material-icons-outlined upload-icon"> file_upload </span>
          <h3 className="dynamic-message"> Drag & drop any file here </h3>
          <label className="label">
            <span className="browse-files">
              <input type="file" className="default-file-input" onChange={handleFileChange} />
              <span className="browse-files-text">Select file</span>
            </span>
          </label>
        </div>
        {file && (
          <section>
            File details:
            <ul>
              <li>Name: {file.name}</li>
            </ul>
          </section>
        )}
        {showAlert && (!file) && (
          <div className="alert">
            <span className="material-icons-outlined">error</span> Please select a file first{" "}
            <span className="material-icons-outlined cancel-alert-button" onClick={closeAlert} style={{ cursor: "pointer" }}>
              cancel
            </span>
          </div>
        )}
        <div className="file-block">
          <div className="file-info">
            <span className="material-icons-outlined file-icon">description</span>
            <span className="file-name"> </span> | <span className="file-size"> </span>
          </div>
          <span className="material-icons remove-file-icon">delete</span>
          <div className="progress-bar"> </div>
        </div>
        <button type="button" className="upload-button" onClick={handleChange}>
          Upload
        </button>
      </div>
    </form>
  );
};

export default FileUploader;
