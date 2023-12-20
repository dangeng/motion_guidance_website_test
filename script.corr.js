function drawCircle(canvas, radius, color, x, y) {
    var ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.lineWidth = 10; // Adjust this value to change the border thickness
    ctx.stroke();
}

/*
Given an array of displacements (see `loadArrowDirectionsFromDisk`)
and an event, draw an arrow on the given canvas
*/
function updateCircle(event, canvas_tgt, directions) {
    // Get canvas
    var thisCanvas = event.target;

    // Get mouse location, relative to canvas
    var rect = thisCanvas.getBoundingClientRect();
    const mouseX = Math.round(event.clientX - rect.left);
    const mouseY = Math.round(event.clientY - rect.top);

    // Get size of arrow
    const arrowSize = directions[mouseY][mouseX];

    // Draw circle
    clearCanvas(thisCanvas);
    drawCircle(thisCanvas, 15, 'blue', mouseX, mouseY);

    // Draw corresponding circle on other canvas
    clearCanvas(canvas_tgt);
    drawCircle(canvas_tgt, 15, 'blue', mouseX + arrowSize[0], mouseY + arrowSize[1]);

    // Also draw arrow on source canvas
    // If arrow is size 0, don't draw it
    if (arrowSize[0] === 0 && arrowSize[1] === 0) {
    } else {
        // Draw a new arrow
        const arrowX = mouseX + arrowSize[0];
        const arrowY = mouseY + arrowSize[1];
        drawArrow(
            thisCanvas.getContext("2d"), 
            mouseX, mouseY, 
            arrowX, arrowY, 
            8, 'red'
        );
    }
}

/*
Sets up mouseleave and mousemove listeners for 
a given canvas and a given array of displacements
*/
function setupEventListenersPair(canvas_src, canvas_tgt, directions) {
    // Curry the updateCircle function for mousemove event
    function updateCircleWithDirections(event) {
        updateCircle(event, canvas_tgt, directions);
    }

    // Clear the canvas on mouseleave event
    function handleMouseLeave(event) {
        // Get canvas
        var thisCanvas = event.target;
        clearCanvas(thisCanvas);
        clearCanvas(canvas_tgt);
    }

    // Add listeners
    canvas_src.addEventListener("mouseleave", handleMouseLeave);
    canvas_src.addEventListener("mousemove", updateCircleWithDirections);
}


/*
Initializes a given canvas:
    1. Loads the json displacement data
    2. Waits for loading to finish, then adds event listeners to canvas
*/
function initializeCanvasPair(canvasPair) {
    console.log('initializing canvas pair');
    loadArrowDirectionsFromDisk(canvasPair['src'].dataset.jsonPath).then(directions => {
        setupEventListenersPair(canvasPair['src'], canvasPair['gen'], directions);
    });
}

// Initialize all canvases
function initializeCanvasPairs() {
    var canvasPairs = {};

    var canvases = document.querySelectorAll('canvas.corrViz');

    // Organize canvases into pairs based on their common class
    canvases.forEach(function (canvas) {
        var classes = canvas.classList;
        var pairClass = classes[1]; // example name
        var individualClass = classes[2]; // gen or src

        // Initialize the index if it doesn't exist
        if (!canvasPairs[pairClass]) {
            canvasPairs[pairClass] = {};
        }

        // Add the canvas to the index based on both pair and individual classes
        canvasPairs[pairClass][individualClass] = canvas;
    });

    for (var pairClass in canvasPairs) {
        var canvasPair = canvasPairs[pairClass];
        initializeCanvasPair(canvasPair);
    };
}

// Initialize all canvases on DOM loaded
document.addEventListener("DOMContentLoaded", initializeCanvasPairs);

