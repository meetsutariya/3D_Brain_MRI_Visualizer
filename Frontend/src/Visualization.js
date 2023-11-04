import React, { useLayoutEffect } from "react";
import { initialize, updateCrosshair} from "./main";
import Sidebar from './Sidebar';

// export default function Visualization() {
const Visualization = ({ uploadedFile }) => {

    const [sidebarVisible, setSidebarVisible] = useState(false);

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

    const handleEnter = (coordinates) => {
        const { x, y, z } = coordinates;
        updateCrosshair("sliceX", x, y, z);
        updateCrosshair("sliceY", x, y, z);
        updateCrosshair("sliceZ", x, y, z);
      }

      const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
      }

    return (

        <div className="container1">
        {/* <h1>Visualization Page</h1> */}
        <button onClick={toggleSidebar}>
            {/* You can replace this with an actual icon */}
            ☰
            </button>
            { sidebarVisible && <Sidebar onEnter={handleEnter} /> }
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
