import React, { useLayoutEffect } from "react";
import { initialize, setPoint } from "./main";
import Sidebar from './Sidebar';

const Visualization = ({ uploadedFile }) => {

    useLayoutEffect(() => {

        if (uploadedFile) {
            initialize(uploadedFile);  // Now initialize function can directly access uploadedFile
        }

    }, [uploadedFile]);

    const handleEnter = (coordinates) => {
        const { x, y, z } = coordinates;

        console.log(x, y, z)

        setPoint(x,y,z);

      }

    return (

        <div className="container1">
        {/* <h1>Visualization Page</h1> */}

        <Sidebar onEnter={handleEnter} /> 
        <div id="sliceX"></div>
        
        <div className="last-container">
        <div id="threeD"></div>
        <div id="sliceZ"></div>
        </div>

        <div id="sliceY"></div>
        </div>

    );
}


export default Visualization;
