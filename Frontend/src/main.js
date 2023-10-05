/* global X */
/* global dat */

let gui;

export function destroyGUI() {
  if (gui) {
    gui.destroy();
    gui = null;
  }
}

function updateCrosshair(containerId, x, y) {
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
  }

export function initialize(niiFile) {

    destroyGUI();
    // Your existing JavaScript code, adjusted if necessary

    // window.onload = function () {

        //
        // try to create the 3D renderer
        //
        console.log("NII file: ", niiFile);
        let _webGLFriendly = true;
        let threeD, volume;
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
        var sliceX = new X.renderer2D();
        sliceX.container = 'sliceX';
        sliceX.orientation = 'X';
        sliceX.init();
        // .. for Y
        var sliceY = new X.renderer2D();
        sliceY.container = 'sliceY';
        sliceY.orientation = 'Y';
        sliceY.init();
        // .. and for Z
        var sliceZ = new X.renderer2D();
        sliceZ.container = 'sliceZ';
        sliceZ.orientation = 'Z';
        sliceZ.init();


        //
        // THE VOLUME DATA
        //
        // create a X.volume
        volume = new X.volume();
        // .. and attach the single-file dicom in .NRRD format
        // this works with gzip/gz/raw encoded NRRD files but XTK also supports other
        // formats like MGH/MGZ

        // var fileURL = window.URL.createObjectURL(niiFile);
        // console.log(fileURL)
        // console.log("type: " + typeof(volume.file))
        // volume.file = './Brats18_2013_1_1_t1ce.nii';
        volume.file=niiFile.name;
        // volume.file = 'https://x.babymri.org/?avf.nii';
        // volume.file = 'E:\my_mri_visualizer\Brats18_2013_0_1_t1.nii';
        // we also attach a label map to show segmentations on a slice-by-slice base
        // volume.labelmap.file = 'http://x.babymri.org/?seg.nrrd';
        // .. and use a color table to map the label map values to colors
        // volume.labelmap.colortable.file = 'http://x.babymri.org/?genericanatomy.txt';

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

            console.log(gui)

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

// Adding mousemove event listener to sliceX container
document.getElementById("sliceX").addEventListener("mousemove", function (event) {
    const rect = this.getBoundingClientRect();
    const x = event.clientX - rect.left; // x position within the element.
    const y = event.clientY - rect.top;  // y position within the element.

    // Update crosshair
    updateCrosshair("sliceX", x, y);

    // Normalize these coordinates and map them to the volume dimensions
    const normalizedX = x / this.offsetWidth;
    const normalizedY = y / this.offsetHeight;

    const newSliceY = Math.floor(normalizedX * volume.range[1]);
    const newSliceZ = Math.floor(normalizedY * volume.range[2]);

    // Update slices in other 2D renderers
    volume.indexY = newSliceY;
    volume.indexZ = newSliceZ;

    // Re-render slices
    sliceY.render();
    sliceZ.render();

        });
// Adding mousemove event listener to sliceY container
document.getElementById("sliceY").addEventListener("mousemove", function (event) {
    const rect = this.getBoundingClientRect();
    const x = event.clientX - rect.left; // x position within the element.
    const y = event.clientY - rect.top;  // y position within the element.

    // Update crosshair
    updateCrosshair("sliceY", x, y);

    // Normalize these coordinates and map them to the volume dimensions
    const normalizedX = x / this.offsetWidth;
    const normalizedY = y / this.offsetHeight;

    const newSliceX = Math.floor(normalizedX * volume.range[1]);
    const newSliceZ = Math.floor(normalizedY * volume.range[2]);

    // Update slices in other 2D renderers
    volume.indexX = newSliceX;
    volume.indexZ = newSliceZ;

    // Re-render slices
    sliceX.render();
    sliceZ.render();

        });
// Adding mousemove event listener to sliceX container
document.getElementById("sliceZ").addEventListener("mousemove", function (event) {
    const rect = this.getBoundingClientRect();
    const x = event.clientX - rect.left; // x position within the element.
    const y = event.clientY - rect.top;  // y position within the element.

    // Update crosshair
    updateCrosshair("sliceZ", x, y);

    // Normalize these coordinates and map them to the volume dimensions
    const normalizedX = x / this.offsetWidth;
    const normalizedY = y / this.offsetHeight;

    const newSliceX = Math.floor(normalizedX * volume.range[1]);
    const newSliceY = Math.floor(normalizedY * volume.range[2]);

    // Update slices in other 2D renderers
    volume.indexX = newSliceX;
    volume.indexY = newSliceY;

    // Re-render slices
    sliceX.render();
    sliceY.render();

        });

        

        // };

    };


    // ... (rest of your code)

}

// export function destroyGUI() {
//     if (gui) {
//         gui.destroy();
//     }
// }
