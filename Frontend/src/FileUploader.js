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
  };

  return (
    <div>
      <h1>Upload NII File</h1>
      <input type="file" onChange={handleChange} />
    </div>
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
