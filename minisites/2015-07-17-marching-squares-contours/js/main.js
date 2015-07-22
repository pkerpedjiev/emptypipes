requirejs.config({
    //By default load any module IDs from js/lib
    urlArgs: "bust=v2",
    baseUrl: 'js',
});

// Start the main app logic.
requirejs(['lib/d3.min', "lib/marchingsquares-isobands", 
          "circle-marchingsquares-example",
          "circle-conrec-example"],
function   (d3, MarchingSquaresJS, 
            drawMarchingSquaresContours, blah) {
    //jQuery, canvas and the app/sub module are all
    //loaded and can be used here now.
                //
    drawMarchingSquaresContours();
});
