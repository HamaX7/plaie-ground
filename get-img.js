var WIDTH = 300;
imgProcessing("image-plaie-1", "copie-1", "img/plaie1.jpg");
imgProcessing("image-plaie-2", "copie-2", "img/plaie2.jpg");
imgProcessing("image-plaie-3", "copie-3", "img/plaie3.jpg");
imgProcessing("image-plaie-4", "copie-4", "img/plaie4.jpg");
imgProcessing("image-plaie-5", "copie-5", "img/plaie5.jpg");
imgProcessing("image-plaie-6", "copie-6", "img/plaie6.jpg");

/*
** BEGIN IMAGE PROCESSING
*/
function imgProcessing(imgName, copyName, fileName)
{
    console.log("processing " + imgName);
    // Image and canvas initialization
    var c = document.getElementById(imgName);
    var ctx = c.getContext("2d");
    var imgPlaie = new Image();
    imgPlaie.src = fileName;

    // Image processing onload
    imgPlaie.onload = function()
    {
        // Height and width modification
        imgPlaie.height *= WIDTH / imgPlaie.width;
        imgPlaie.width = WIDTH;

        // Image without modificiation: display
        ctx.clearRect(0, 0, c.width, c.height);
        c.width = imgPlaie.width;
        c.height = imgPlaie.height;
        ctx.drawImage(imgPlaie, 0, 0, imgPlaie.width, imgPlaie.height);

        // Copy of initial image data
        var copie_imgPlaie = ctx.getImageData( 0, 0, imgPlaie.width, imgPlaie.height);
        var pixels = copie_imgPlaie.data;

        // Color processing on copy
        pixels = pixelsColorProcessing(pixels, copie_imgPlaie.width);

        // Corners detection on copy
        var corners = cornerDetection(pixels, copie_imgPlaie.width, copie_imgPlaie.height);

        // Edges detection on copy
        var edges = edgeDetection(pixels, copie_imgPlaie.width, copie_imgPlaie.height);

        squareDetection(pixels, copie_imgPlaie.width, copie_imgPlaie.height);

        pixels = edges;

        // Set copy pixels with new pixels
        copie_imgPlaie.data = pixels;

        // Image copy: display
        var copie = document.getElementById(copyName);
        copie.width = imgPlaie.width;
        copie.height = imgPlaie.height;
        var ctxCopie = copie.getContext("2d");
    	ctxCopie.putImageData(copie_imgPlaie, 0, 0);

        // Print corners pixels
        /*for (var i = 0; i < corners.length; i += 2) {
            ctxCopie.fillStyle = '#61F600';
            ctxCopie.fillRect(corners[i], corners[i + 1], 1, 1);
        }*/
    }
};
/*
** END IMAGE PROCESSING
*/


/*
** BEGIN PIXELS COLOR PROCESSING
*/
function pixelsColorProcessing(pixels, width)
{
    var height = (pixels.length / 4) / width;
    var sat = 0;
    var cpt = 0;
    for (i = 0; i < pixels.length; i = i + 4)
    {
        var hsv = rgbToHsv(pixels[i], pixels[i + 1], pixels[i + 2]);
        cpt++;
        sat = sat + hsv['s'];
        if (hsv['h'] > 0.44 && hsv['h'] < 0.58
        && hsv['s'] > 0.10 && hsv['s'] < 0.90
        && hsv['v'] > 0.05 && hsv['v'] < 0.98)
        {
            pixels[i] = 0;
            pixels[i+1] = 0;
            pixels[i+2] = 255;
            pixels[i+3] = 255;
        }
        else if ((hsv['h'] < 0.025 || hsv['h'] > 0.95)
            && hsv['s'] > 0.5 && hsv['s'] < 0.95
            && hsv['v'] > 0.15 && hsv['v'] < 0.95) //s = 0.56 pour plaie ouverte, 0.4 pour supurante
        {
            pixels[i] = 255;
            pixels[i+1] = 0;
            pixels[i+2] = 0;
            pixels[i+3] = 255;
        }
        else
        {
            pixels[i] = 0;
            pixels[i+1] = 0;
            pixels[i+2] = 0;
            pixels[i+3] = 0;
        }
    }
    sat = sat / cpt;
    console.log("Saturation:" + sat);
    for (var z = 0; z < 10; z++)
    {
        // Basic noise reduction for red
        for (i = 0; i < pixels.length; i = i + 4)
        {
            var color_sum = pixels[i - 4]
                            + pixels[i + 4]
                            + pixels[i - 8]
                            + pixels[i + 8]
                            + pixels[i - (4 * width)]
                            + pixels[i + (4 * width)]
                            + pixels[i - (4 * width) - 4]
                            + pixels[i - (4 * width) + 4]
                            + pixels[i - (4 * width) - 8]
                            + pixels[i - (4 * width) + 8]
                            + pixels[i + (4 * width) - 4]
                            + pixels[i + (4 * width) + 4]
                            + pixels[i + (4 * width) - 8]
                            + pixels[i + (4 * width) + 8]
                            + pixels[i - (4 * 2 * width)]
                            + pixels[i - (4 * 2 * width) - 4]
                            + pixels[i - (4 * 2 * width) + 4]
                            + pixels[i - (4 * 2 * width) - 8]
                            + pixels[i - (4 * 2 * width) + 8]
                            + pixels[i + (4 * 2 * width)]
                            + pixels[i + (4 * 2 * width) - 4]
                            + pixels[i + (4 * 2 * width) + 4]
                            + pixels[i + (4 * 2 * width) - 8]
                            + pixels[i + (4 * 2 * width) + 8];
            if (pixels[i] == 255 && color_sum < 800) //here is the value to change for a different noise reduction strength
            {
                pixels[i] = 0;
                pixels[i+1] = 0;
                pixels[i+2] = 0;
                pixels[i+3] = 0;
            }
            else if (pixels[i] == 0 && color_sum > 3060) //here is the value to change for a different noise reduction strength -3060 = 50%
            {
                pixels[i] = 255;
                pixels[i+1] = 0;
                pixels[i+2] = 0;
                pixels[i+3] = 255;
            }
        }
        // Basic noise reduction for blue
        for (i = 2; i < pixels.length; i = i + 4)
        {
            color_sum = pixels[i - 4]
                        + pixels[i + 4]
                        + pixels[i - 8]
                        + pixels[i + 8]
                        + pixels[i - (4 * width)]
                        + pixels[i + (4 * width)]
                        + pixels[i - (4 * width) - 4]
                        + pixels[i - (4 * width) + 4]
                        + pixels[i - (4 * width) - 8]
                        + pixels[i - (4 * width) + 8]
                        + pixels[i + (4 * width) - 4]
                        + pixels[i + (4 * width) + 4]
                        + pixels[i + (4 * width) - 8]
                        + pixels[i + (4 * width) + 8]
                        + pixels[i - (4 * 2 * width)]
                        + pixels[i - (4 * 2 * width) - 4]
                        + pixels[i - (4 * 2 * width) + 4]
                        + pixels[i - (4 * 2 * width) - 8]
                        + pixels[i - (4 * 2 * width) + 8]
                        + pixels[i + (4 * 2 * width)]
                        + pixels[i + (4 * 2 * width) - 4]
                        + pixels[i + (4 * 2 * width) + 4]
                        + pixels[i + (4 * 2 * width) - 8]
                        + pixels[i + (4 * 2 * width) + 8];
            if (pixels[i] == 255 && color_sum < 800) //here is the value to change for a different noise reduction strength
            {
                i = i - 2;
                pixels[i] = 0;
                pixels[i+1] = 0;
                pixels[i+2] = 0;
                pixels[i+3] = 0;
                i = i + 2;
            }
            else if (pixels[i] == 0 && color_sum > 3060) //here is the value to change for a different noise reduction strength -3060
            {
                i = i - 2;
                pixels[i] = 0;
                pixels[i+1] = 0;
                pixels[i+2] = 255;
                pixels[i+3] = 255;
                i = i + 2;
            }
        }

        console.log("### width = " + width + " ### height = " + height);
        for (i = 0; i < height; i++)
        {
            for (j = 0; j < (width * 4); j = j + 4)
            {
                var k = (i * width * 4) + j;
                var setToGreen = 0;

                if (pixels[k] == 255 &&
                    (i == 0
                    || i == (height - 1)
                    || j == 0
                    || j == (width - 1)))
                {
                    setToGreen = 1;
                }
                else if (pixels[k] == 0)
                {
                    if (i == 0 && (pixels[k - 4] + pixels[k + 4] + pixels[k + (4 * width)] + pixels[k + (4 * width) - 4] + pixels[k + (4 * width) + 4]) > 0)
                    {
                        setToGreen = 1;
                    }
                    else if (i == (height - 1) && (pixels[k - 4] + pixels[k + 4] + pixels[k - (4 * width)] + pixels[k - (4 * width) - 4] + pixels[k - (4 * width) + 4]) > 0)
                    {
                        setToGreen = 1;
                    }
                    else if (j == 0 && (pixels[k + 4] + pixels[k - (4 * width)] + pixels[k - (4 * width) + 4] + pixels[k + (4 * width)] + pixels[k + (4 * width) + 4]) > 0)
                    {
                        setToGreen = 1;
                    }
                    else if (j == (width - 1) && (pixels[k - 4] + pixels[k - (4 * width)] + pixels[k - (4 * width) - 4] + pixels[k + (4 * width)] + pixels[k + (4 * width) - 4]) > 0)
                    {
                        setToGreen = 1;
                    }
                    else if ((pixels[k - 4] + pixels[k + 4] + pixels[k + (4 * width)] + pixels[k - (4 * width)] + pixels[k + (4 * width) - 4] + pixels[k + (4 * width) + 4] + pixels[k - (4 * width) - 4] + pixels[k - (4 * width) + 4]) > 0)
                    {
                        setToGreen = 1;
                    }
                }
                if (setToGreen == 1)
                {
                    pixels[k] = 0;
                    pixels[k+1] = 255;
                    pixels[k+2] = 0;
                    pixels[k+3] = 255;
                }
            }
        }
    }

    var countBlue = 0;
    for (i = 0; i < pixels.length; i = i + 4)
    {
        if (pixels[i] == 0 && pixels[i+1] == 0 && pixels[i+2] == 255)
        {
        countBlue = countBlue + 1;
        }
    }
    var countRed = 0;
    for (i = 0; i < pixels.length; i = i + 4)
    {
        if (pixels[i] == 255 && pixels[i+1] == 0 && pixels[i+2] == 0)
        {
        countRed = countRed + 1;
        }
    }
    console.log("Blue : " + countBlue);
    console.log("Red : " + countRed);

    var tailleplaie = (countRed / countBlue) * 4;
    console.log('La plaie fait ' + tailleplaie +' cm²');
    return (pixels);
};
/*
** END PIXELS COLOR PROCESSING
*/

/*
** BEGIN CORNERS DETECTION
*/
function cornerDetection(pixels, width, height)
{
    var grays = tracking.Image.grayscale(pixels, width, height);
    var corners = tracking.Fast.findCorners(grays, width, height, 40);
    return corners;
}
/*
** END CORNERS DETECTION
*/


/*
** BEGIN EDGES DETECTION
*/
function edgeDetection(pixels, width, height)
{
    var edges = pixels.slice(0);
    return edges;
}
/*
** END EDGES DETECTION
*/


/*
** BEGIN SQUARE DETECTION
*/
function squareDetection(pixels, width, height)
{
    var top = {x:0, y:0, i:0};
    var bottom = {x:0, y:0, i:0};
    var right = {x:0, y:0, i:0};
    var left = {x:0, y:0, i:0};

    for (i = 0; i < height; i = i + 4)
    {
        for (j = 0; j < width; j = j + 4)
        {
            if (isBlue(pixels, (i * width) + j))
            {
                if (i > top.x)
                {
                    top.x = i;
                    top.y = j;
                    top.i = (i * width) + j;

                }
            }
        }
    }

    function recursive(pixels, p)
    {

    }

    function radiation(pixels, p)
    {
        
    }

    function isBlue(pixels, p)
    {
        if (pixels[p] == 0 &&
            pixels[p + 1] == 0 &&
            pixels[p + 2] == 255)
        {
            return (true);
        }
        else
        {
            return (false);
        }
    }
}
/*
** END SQUARE DETECTION
*/
