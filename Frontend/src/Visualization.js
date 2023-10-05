import React, { useLayoutEffect } from "react";
import { initialize} from "./main";

// export default function Visualization() {
const Visualization = ({ uploadedFile }) => {

    useLayoutEffect(() => {

        if (uploadedFile) {
            initialize(uploadedFile);  // Now your initialize function can directly access uploadedFile
        }

    }, [uploadedFile]);

    // function handleChange() {
    //     if (uploadedFile) {
    //         initialize(uploadedFile);  // Now your initialize function can directly access uploadedFile
    //     }
    // }

    return (

        <div>
            <h1>Visualization Page</h1>
            <div id="3d" style={{ backgroundColor: '#000000', width: '100%', height: '70%', marginBottom: '2px' }}></div>
            <div id="sliceX"
                style={{ borderTop: '2px solid yellow', backgroundColor: '#000', width: '32%', height: '30%', float: 'left' }}></div>
            <div id="sliceY" style={{ borderTop: '2px solid red', backgroundColor: '#000', width: '32%', height: '30%', float: 'left' }}>
            </div>
            <div id="sliceZ" style={{ borderTop: '2px solid green', backgroundColor: '#000', width: '32%', height: '30%', float: 'left' }}>
            </div>
            {/* <button onClick={handleChange}>Button</button> */}
        </div>
    );
}


export default Visualization;
