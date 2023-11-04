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
            <h1>Visualization Page</h1>
            <button onClick={toggleSidebar}>
            {/* You can replace this with an actual icon */}
            ☰
            </button>
            { sidebarVisible && <Sidebar onEnter={handleEnter} /> }
            {/* <div id="threeD" style={{ backgroundColor: '#000000', width: '100%', height: '100%', marginBottom: '2px' }}></div> */}

            <div id="threeD"></div>
            {/* <div id="sliceX"
                style={{ borderTop: '2px solid yellow', backgroundColor: '#000', width: '32%', height: '30%', float: 'left' }}></div>
            <div id="sliceY" style={{ position:'relative', borderTop: '2px solid red', backgroundColor: '#000', width: '32%', height: '30%', float: 'left' }}>
            </div>
            <div id="sliceZ" style={{ position:'relative', borderTop: '2px solid green', backgroundColor: '#000', width: '32%', height: '30%', float: 'left' }}>
            </div> */}
            <div className="slice-container">
            <div id="sliceX"></div>
            <div id="sliceY"></div>
            <div id="sliceZ"></div>
            </div>
            {/* <button onClick={handleChange}>Button</button> */}
        </div>
    );
}


export default Visualization;
