/* global X */
/* global dat */

let gui;
let isCrosshairFixed = false;
let threeD, volume, sliceX, sliceY, sliceZ;
let sliceX_width, sliceX_height, sliceY_width, sliceY_height, sliceZ_width, sliceZ_height, IndexX, IndexY, IndexZ;


export function destroyGUI() {
  if (gui) {
    gui.destroy();
    gui = null;
  }
}


// function for update crosshair to given normalized point

export function updateCrosshair(containerId, x, y, x_, y_, z_) {
    const svgNamespace = "http://www.w3.org/2000/svg";
  
    let svg = document.getElementById(containerId + "-svg");
    if (!svg) {
      svg = document.createElementNS(svgNamespace, "svg");
      svg.setAttribute("id", containerId + "-svg");
      svg.style.position = "absolute";
      svg.style.top = "0";
      svg.style.left = "0";
      svg.style.width = "100%";
      svg.style.height = "100%";
      svg.style.pointerEvents = "none";
      document.getElementById(containerId).appendChild(svg);
    }
  
    let lineX = document.getElementById(containerId + "-lineX");
    let lineY = document.getElementById(containerId + "-lineY");
  
    if (!lineX) {
      lineX = document.createElementNS(svgNamespace, "line");
      lineX.setAttribute("id", containerId + "-lineX");
      lineX.setAttribute("stroke", "red");
      svg.appendChild(lineX);
    }
  
    if (!lineY) {
      lineY = document.createElementNS(svgNamespace, "line");
      lineY.setAttribute("id", containerId + "-lineY");
      lineY.setAttribute("stroke", "red");
      svg.appendChild(lineY);
    }
  
    lineX.setAttribute("x1", x);
    lineX.setAttribute("y1", "0");
    lineX.setAttribute("x2", x);
    lineX.setAttribute("y2", "100%");
  
    lineY.setAttribute("x1", "0");
    lineY.setAttribute("y1", y);
    lineY.setAttribute("x2", "100%");
    lineY.setAttribute("y2", y);

    // Create or update text element to display coordinates
    let textElement = document.getElementById(containerId + "-text");
    if (!textElement) {
        textElement = document.createElementNS(svgNamespace, "text");
        textElement.setAttribute("id", containerId + "-text");
        textElement.setAttribute("fill", "white");
        textElement.setAttribute("x", "10"); // Fixed position for simplicity
        textElement.setAttribute("y", "20");
        svg.appendChild(textElement);
    }

    textElement.textContent = `X: ${x_}, Y: ${y_}, Z: ${z_}`;
  }

export async function initialize(niiFile) {

    destroyGUI();

        //
        // try to create the 3D renderer
        //
        console.log("NII file: ", niiFile);
        let _webGLFriendly = true;
        try {
            // try to create and initialize a 3D renderer
            threeD = new X.renderer3D();
            threeD.container = 'threeD';
            threeD.init();
        } catch (Exception) {

            // no webgl on this machine
            _webGLFriendly = false;

        }

        //
        // create the 2D renderers
        // .. for the X orientation
        sliceX = new X.renderer2D();
        sliceX.container = 'sliceX';
        sliceX.orientation = 'X';
        sliceX.init();
        // .. for Y
        sliceY = new X.renderer2D();
        sliceY.container = 'sliceY';
        sliceY.orientation = 'Y';
        sliceY.init();
        // .. and for Z
        sliceZ = new X.renderer2D();
        sliceZ.container = 'sliceZ';
        sliceZ.orientation = 'Z';
        sliceZ.init();

        sliceX_width = document.getElementById("sliceX").offsetWidth;
        sliceX_height = document.getElementById("sliceX").offsetHeight;
        sliceY_width = document.getElementById("sliceY").offsetWidth;
        sliceY_height = document.getElementById("sliceY").offsetHeight;
        sliceZ_width = document.getElementById("sliceZ").offsetWidth;
        sliceZ_height = document.getElementById("sliceZ").offsetHeight;


        //
        // THE VOLUME DATA
        //
        // create a X.volume

        // console.log(X)
        volume = new X.volume();

        console.log("1:", volume.file)
        console.log(volume.filedata)
        volume.file=niiFile.name;
        console.log("2:", volume.file)

        // console.log(typeof(volume.filedata);

        async function LoadFileData()
        {
          await niiFile.arrayBuffer().then(result=>{

              volume.filedata = result;
              // console.log('File Data:', volume.filedata)

            })           
        }

        const a1 = await LoadFileData();     // wait till file data loaded successfully


        console.log("volumn type : ",typeof(volume));
        console.log("file type : " + typeof(volume.file));
        console.log("volumn : ",volume);
        console.log(volume['filedata'])

        // add the volume in the main renderer
        // we choose the sliceX here, since this should work also on
        // non-webGL-friendly devices like Safari on iOS
        sliceX.add(volume);

        // start the loading/rendering
        sliceX.render();

        //
        // THE GUI
        //
        // the onShowtime method gets executed after all files were fully loaded and
        // just before the first rendering attempt
        sliceX.onShowtime = function () {

            //
            // add the volume to the other 3 renderers
            //
            sliceY.add(volume);
            sliceY.render();
            sliceZ.add(volume);
            sliceZ.render();

            if (_webGLFriendly) {
                threeD.add(volume);
                threeD.render();
            }

            IndexX = volume.indexX;
            IndexY = volume.indexY;
            IndexZ = volume.indexZ;

            // console.log(gui)

            // if Don't want right side GUI box then comment below code of GUI
//-----------------------------------------------------------------------------------------------

            // now the real GUI
            gui = new dat.GUI();
            console.log(gui)


            // the following configures the gui for interacting with the X.volume
            var volumegui = gui.addFolder('Volume');
            // now we can configure controllers which..
            // .. switch between slicing and volume rendering
            var vrController = volumegui.add(volume, 'volumeRendering');
            // .. configure the volume rendering opacity
            var opacityController = volumegui.add(volume, 'opacity', 0, 1);
            // .. and the threshold in the min..max range
            var lowerThresholdController = volumegui.add(volume, 'lowerThreshold',
                volume.min, volume.max);
            var upperThresholdController = volumegui.add(volume, 'upperThreshold',
                volume.min, volume.max);
            var lowerWindowController = volumegui.add(volume, 'windowLow', volume.min,
                volume.max);
            var upperWindowController = volumegui.add(volume, 'windowHigh', volume.min,
                volume.max);
            // the indexX,Y,Z are the currently displayed slice indices in the range
            // 0..dimensions-1
            var sliceXController = volumegui.add(volume, 'indexX', 0,
                volume.range[0] - 1);
            var sliceYController = volumegui.add(volume, 'indexY', 0,
                volume.range[1] - 1);
            var sliceZController = volumegui.add(volume, 'indexZ', 0,
                volume.range[2] - 1);
            volumegui.open();

//--------------------------------------------------------------------------------------------

//---------------- Click event begin------------------------

document.getElementById("sliceX").addEventListener("click", function(event) {
  // console.log('click')
  if (isCrosshairFixed) {
      isCrosshairFixed = false;
  } else {
      isCrosshairFixed = true;
  }
});
document.getElementById("sliceY").addEventListener("click", function(event) {
  if (isCrosshairFixed) {
      isCrosshairFixed = false;
  } else {
      isCrosshairFixed = true;
  }
});
document.getElementById("sliceZ").addEventListener("click", function(event) {
  if (isCrosshairFixed) {
      isCrosshairFixed = false;
  } else {
      isCrosshairFixed = true;
  }
});

//--------------------Click event end-------------------------

//-------------------arrowkey event begin---------------------------------

// Step 1: Make slice boxes focusable and handle click to focus
["sliceX", "sliceY", "sliceZ"].forEach(id => {
    const element = document.getElementById(id);
    element.tabIndex = 0;  // Make the element focusable
    element.addEventListener("click", function() {
        this.focus();  // Focus the element when clicked
    });
});

// Step 2: Implement the keydown logic

// For sliceX
document.getElementById("sliceX").addEventListener("keydown", function(event) {
    event.stopPropagation();
    event.preventDefault();

    console.log('key')
    if(!isCrosshairFixed)
    isCrosshairFixed = true;
  
    const key = event.key;
  
    switch(key){
  
      case "ArrowLeft":      
  
      volume.indexY--;
      break;
  
      case "ArrowRight":     
  
      volume.indexY++;
      break;
  
      case "ArrowUp":      
  
      volume.indexZ--;
      break;  
      
      case "ArrowDown":
  
      volume.indexZ++; 
      break; 

      default:
      break;
  
    }
  
    //Denormalization

    const X_normalizedY = volume.indexY / volume.range[1];
    const X_normalizedZ = volume.indexZ / volume.range[2];

    const x = X_normalizedY * sliceX_width;
    const y = X_normalizedZ * sliceX_height;

      //for plane Y
  
      const Y_normalizedX =  volume.indexX / volume.range[0];
      const Y_normalizedZ =  volume.indexZ / volume.range[2];
  
      const Y_boxX = Y_normalizedX * sliceY_width;
      const Y_boxZ = Y_normalizedZ * sliceY_height;
      
      //for plane Z
  
      const Z_normalizedX =  volume.indexX / volume.range[0];
      const Z_normalizedY =  volume.indexY / volume.range[1];
  
      const Z_boxX = Z_normalizedX * sliceZ_width;
      const Z_boxY = Z_normalizedY * sliceZ_height; 
  
      // Update crosshair
      updateCrosshair("sliceX", x, y, volume.indexX, volume.indexY, volume.indexZ);
      updateCrosshair("sliceY", Y_boxX, Y_boxZ, volume.indexX, volume.indexY, volume.indexZ);
      updateCrosshair("sliceZ", Z_boxX, Z_boxY, volume.indexX, volume.indexY, volume.indexZ);
  
      // Re-render slices
      sliceY.render();
      sliceZ.render();

      IndexX = volume.indexX;
      IndexY = volume.indexY;
      IndexZ = volume.indexZ;
  
});

// For sliceY
document.getElementById("sliceY").addEventListener("keydown", function(event) {
    event.stopPropagation();
    event.preventDefault();

    if(!isCrosshairFixed)
    isCrosshairFixed = true;
  
    const key = event.key;
  
    switch(key){
  
      case "ArrowLeft":      
  
      volume.indexX--;
      break;
  
      case "ArrowRight":     
  
      volume.indexX++;
      break;
  
      case "ArrowUp":      
  
      volume.indexZ--;
      break;  
      
      case "ArrowDown":
  
      volume.indexZ++; 
      break; 

      default:
      break;
  
    }

    //Denormalization
  
    const Y_normalizedX = volume.indexX / volume.range[0];
    const Y_normalizedZ = volume.indexZ / volume.range[2];

    const x = Y_normalizedX * sliceY_width;
    const y = Y_normalizedZ * sliceY_height;

      //for plane X
  
      const X_normalizedY =  volume.indexY / volume.range[1];
      const X_normalizedZ =  volume.indexZ / volume.range[2];
  
      const X_boxY = X_normalizedY * sliceX_width;
      const X_boxZ = X_normalizedZ * sliceX_height;
      
      //for plane Z
  
      const Z_normalizedX =  volume.indexX / volume.range[0];
      const Z_normalizedY =  volume.indexY / volume.range[1];
  
      const Z_boxX = Z_normalizedX * sliceZ_width;
      const Z_boxY = Z_normalizedY * sliceZ_height; 
  
      // Update crosshair
      updateCrosshair("sliceX", X_boxY, X_boxZ, volume.indexX, volume.indexY, volume.indexZ);
      updateCrosshair("sliceY", x, y, volume.indexX, volume.indexY, volume.indexZ);
      updateCrosshair("sliceZ", Z_boxX, Z_boxY, volume.indexX, volume.indexY, volume.indexZ);
  
      // Re-render slices
      sliceX.render();
      sliceZ.render();

      IndexX = volume.indexX;
      IndexY = volume.indexY;
      IndexZ = volume.indexZ;
});

// For sliceZ
document.getElementById("sliceZ").addEventListener("keydown", function(event) {
    event.stopPropagation();
    event.preventDefault();

    if(!isCrosshairFixed)
    isCrosshairFixed = true;
  
    const key = event.key;
  
    switch(key){
  
      case "ArrowLeft":      
  
      volume.indexX--;
      break;
  
      case "ArrowRight":     
  
      volume.indexX++;
      break;
  
      case "ArrowUp":      
  
      volume.indexY--;
      break;  
      
      case "ArrowDown":
  
      volume.indexY++; 
      break; 

      default:
      break;

  
    }

    //Denormalization
  
    const Z_normalizedX = volume.indexX / volume.range[0];
    const Z_normalizedY = volume.indexY / volume.range[1];
    
    const x = Z_normalizedX * sliceZ_width;
    const y = Z_normalizedY * sliceZ_height;

      //for plane X
  
      const X_normalizedY =  volume.indexY / volume.range[1];
      const X_normalizedZ =  volume.indexZ / volume.range[2];
  
      const X_boxY = X_normalizedY * sliceX_width;
      const X_boxZ = X_normalizedZ * sliceX_height;
      
      //for plane Y
  
      const Y_normalizedX =  volume.indexX / volume.range[0];
      const Y_normalizedZ =  volume.indexZ / volume.range[2];
  
      const Y_boxX = Y_normalizedX * sliceY_width;
      const Y_boxZ = Y_normalizedZ * sliceY_height; 
  
      // Update crosshair
      updateCrosshair("sliceX", X_boxY, X_boxZ, volume.indexX, volume.indexY, volume.indexZ);
      updateCrosshair("sliceY", Y_boxX, Y_boxZ, volume.indexX, volume.indexY, volume.indexZ);
      updateCrosshair("sliceZ", x, y, volume.indexX, volume.indexY, volume.indexZ);
  
      // Re-render slices
      sliceX.render();
      sliceY.render();

      IndexX = volume.indexX;
      IndexY = volume.indexY;
      IndexZ = volume.indexZ;
});

//----------------------arrow key end-----------------------------------------

//-----------------mousemove event begin--------------------------------------

// Adding mousemove event listener to sliceX container
document.getElementById("sliceX").addEventListener("mousemove", function (event) {

  if(isCrosshairFixed)
  return;

    const rect = this.getBoundingClientRect();
    const x = event.clientX - rect.left; // x position within the element.
    const y = event.clientY - rect.top;  // y position within the element.

    //Normalization
    // Normalize these coordinates and map them to the volume dimensions
    const normalizedX = x / sliceX_width;
    const normalizedY = y / sliceX_height;

    const newSliceY = Math.floor(normalizedX * volume.range[1]);
    const newSliceZ = Math.floor(normalizedY * volume.range[2]);

    // Update slices in other 2D renderers
    volume.indexY = newSliceY;
    volume.indexZ = newSliceZ;

    // set crosshair for other planes
    
    //for plane Y

    const Y_normalizedX =  volume.indexX / volume.range[0];
    const Y_normalizedZ =  volume.indexZ / volume.range[2];

    const Y_boxX = Y_normalizedX * sliceY_width;
    const Y_boxZ = Y_normalizedZ * sliceY_height;
    
    //for plane Z

    const Z_normalizedX =  volume.indexX / volume.range[0];
    const Z_normalizedY =  volume.indexY / volume.range[1];

    const Z_boxX = Z_normalizedX * sliceZ_width;
    const Z_boxY = Z_normalizedY * sliceZ_height;

    // Update crosshair
    updateCrosshair("sliceX", x, y, volume.indexX, volume.indexY, volume.indexZ);
    updateCrosshair("sliceY", Y_boxX, Y_boxZ, volume.indexX, volume.indexY, volume.indexZ);
    updateCrosshair("sliceZ", Z_boxX, Z_boxY, volume.indexX, volume.indexY, volume.indexZ);

    // Re-render slices
    sliceY.render();
    sliceZ.render();

    IndexX = volume.indexX;
    IndexY = volume.indexY;
    IndexZ = volume.indexZ;

        });

// Adding mousemove event listener to sliceY container
document.getElementById("sliceY").addEventListener("mousemove", function (event) {

    if(isCrosshairFixed)
    return;

    const rect = this.getBoundingClientRect();
    const x = event.clientX - rect.left; // x position within the element.
    const y = event.clientY - rect.top;  // y position within the element.

    //Normalization
    // Normalize these coordinates and map them to the volume dimensions
    const normalizedX = x / sliceY_width;
    const normalizedY = y / sliceY_height;

    const newSliceX = Math.floor(normalizedX * volume.range[0]);
    const newSliceZ = Math.floor(normalizedY * volume.range[2]);

    // Update slices in other 2D renderers
    volume.indexX = newSliceX;
    volume.indexZ = newSliceZ;
    
    //for plane X

    const X_normalizedY =  volume.indexY / volume.range[1];
    const X_normalizedZ =  volume.indexZ / volume.range[2];

    const X_boxY = X_normalizedY * sliceX_width;
    const X_boxZ = X_normalizedZ * sliceX_height;
    
    //for plane Z

    const Z_normalizedX =  volume.indexX / volume.range[0];
    const Z_normalizedY =  volume.indexY / volume.range[1];

    const Z_boxX = Z_normalizedX * sliceZ_width;
    const Z_boxY = Z_normalizedY * sliceZ_height;

    // Update crosshair
    updateCrosshair("sliceY", x, y, volume.indexX, volume.indexY, volume.indexZ);
    updateCrosshair("sliceX", X_boxY, X_boxZ, volume.indexX, volume.indexY, volume.indexZ);
    updateCrosshair("sliceZ", Z_boxX, Z_boxY, volume.indexX, volume.indexY, volume.indexZ);

    // Re-render slices
    sliceX.render();
    sliceZ.render();

    IndexX = volume.indexX;
    IndexY = volume.indexY;
    IndexZ = volume.indexZ;

        });

// Adding mousemove event listener to sliceZ container
document.getElementById("sliceZ").addEventListener("mousemove", function (event) {

  if(isCrosshairFixed)
  return;

    const rect = this.getBoundingClientRect();
    const x = event.clientX - rect.left; // x position within the element.
    const y = event.clientY - rect.top;  // y position within the element.

    //Normalization
    // Normalize these coordinates and map them to the volume dimensions
    const normalizedX = x / this.offsetWidth;
    const normalizedY = y / this.offsetHeight;

    const newSliceX = Math.floor(normalizedX * volume.range[0]);
    const newSliceY = Math.floor(normalizedY * volume.range[1]);

    // Update slices in other 2D renderers
    volume.indexX = newSliceX;
    volume.indexY = newSliceY;
    
    //for plane X

    const X_normalizedY =  volume.indexY / volume.range[1];
    const X_normalizedZ =  volume.indexZ / volume.range[2];

    const X_boxY = X_normalizedY * sliceX_width;
    const X_boxZ = X_normalizedZ * sliceX_height;
    
    //for plane Y

    const Y_normalizedX =  volume.indexX / volume.range[0];
    const Y_normalizedZ =  volume.indexZ / volume.range[2];

    const Y_boxX = Y_normalizedX * sliceY_width;
    const Y_boxZ = Y_normalizedZ * sliceY_height;

    // Update crosshair
    updateCrosshair("sliceZ", x, y, volume.indexX, volume.indexY, volume.indexZ);
    updateCrosshair("sliceX", X_boxY, X_boxZ, volume.indexX, volume.indexY, volume.indexZ);
    updateCrosshair("sliceY", Y_boxX, Y_boxZ, volume.indexX, volume.indexY, volume.indexZ);


    // Re-render slices
    sliceX.render();
    sliceY.render();

    IndexX = volume.indexX;
    IndexY = volume.indexY;
    IndexZ = volume.indexZ;

        });
//---------------------mousemove event end--------------------

    };


}

//function for set any point 
export function setPoint(InX, InY, InZ){    // take normalized points

    isCrosshairFixed = true;

    volume.indexX = InX;
    volume.indexY = InY;
    volume.indexZ = InZ;

    console.log(InX, InY, InZ);
    console.log(volume.indexX, volume.indexY, volume.indexZ);


    //Denormalization
    //for plane X
    const X_normalizedY = volume.indexY / volume.range[1];
    const X_normalizedZ = volume.indexZ / volume.range[2];

    const X_boxY = X_normalizedY * sliceX_width;
    const X_boxZ = X_normalizedZ * sliceX_height;
  
    //for plane Y
  
    const Y_normalizedX =  volume.indexX / volume.range[0];
    const Y_normalizedZ =  volume.indexZ / volume.range[2];

    const Y_boxX = Y_normalizedX * sliceY_width;
    const Y_boxZ = Y_normalizedZ * sliceY_height;
    
    //for plane Z

    const Z_normalizedX =  volume.indexX / volume.range[0];
    const Z_normalizedY =  volume.indexY / volume.range[1];

    const Z_boxX = Z_normalizedX * sliceZ_width;
    const Z_boxY = Z_normalizedY * sliceZ_height; 

    // Update crosshair
    updateCrosshair("sliceX", X_boxY, X_boxZ, volume.indexX, volume.indexY, volume.indexZ);
    updateCrosshair("sliceY", Y_boxX, Y_boxZ, volume.indexX, volume.indexY, volume.indexZ);
    updateCrosshair("sliceZ", Z_boxX, Z_boxY, volume.indexX, volume.indexY, volume.indexZ);


    //re-render slices

    sliceX.render();
    sliceY.render();
    sliceZ.render();

    IndexX = volume.indexX;
    IndexY = volume.indexY;
    IndexZ = volume.indexZ;

}

export function addPoint(){

    return ({'x':IndexX,'y': IndexY,'z': IndexZ})

}

// export function destroyGUI() {
//     if (gui) {
//         gui.destroy();
//     }
// }
