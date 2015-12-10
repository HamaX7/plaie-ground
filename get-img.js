var HEIGHT = 400;
imgProcessing("image-plaie-1", "copie-1", "plaie1.jpg");
imgProcessing("image-plaie-2", "copie-2", "plaie2.jpg");
imgProcessing("image-plaie-3", "copie-3", "plaie3.jpg");
//imgProcessing("image-plaie-4", "copie-4", "plaie4.jpg");



/*
** BEGIN IMAGE PROCESSING
*/
function imgProcessing(imgName, copyName, fileName)
{
    // Image and canvas initialization
    var c = document.getElementById(imgName);
    var ctx = c.getContext("2d");
    var imgPlaie = new Image();
    imgPlaie.src = fileName;

    // Image processing onload
    imgPlaie.onload = function()
    {
        // Height and width modification
        imgPlaie.width *= HEIGHT / imgPlaie.height;
        imgPlaie.height = HEIGHT;

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
        pixels = cornerDetection(pixels, copie_imgPlaie.width, copie_imgPlaie.height);

        // Set copy pixels with new pixels
        copie_imgPlaie.data = pixels;

        // Image copy: display
        var copie = document.getElementById(copyName);
        copie.width = imgPlaie.width;
        copie.height = imgPlaie.height;
        var ctxCopie = copie.getContext("2d");
    	ctxCopie.putImageData(copie_imgPlaie, 0, 0);
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
    for (i = 0; i < pixels.length; i = i + 4)
    {
        var hsv = rgbToHsv(pixels[i], pixels[i + 1], pixels[i + 2]);
        if (hsv['h'] > 0.44 && hsv['h'] < 0.55
        && hsv['s'] > 0.10 && hsv['s'] < 0.90
        && hsv['v'] > 0.10 && hsv['v'] < 0.90)
        {
            pixels[i] = 0;
            pixels[i+1] = 0;
            pixels[i+2] = 255;
            pixels[i+3] = 255;
        }
        else if ((hsv['h'] < 0.025 || hsv['h'] > 0.95)
            && hsv['s'] > 0.56 && hsv['s'] < 0.95
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
            pixels[i+3] = 255;
        }
    }
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
        if (pixels[i] == 255 && color_sum < 1400) //here is the value to change for a different noise reduction strength
        {
            pixels[i] = 0;
            pixels[i+1] = 0;
            pixels[i+2] = 0;
            pixels[i+3] = 255;
        }
        else if (pixels[i] == 0 && color_sum > 3000) //here is the value to change for a different noise reduction strength -3060 = 50%
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
            pixels[i+3] = 255;
            i = i + 2;
        }
        else if (pixels[i] == 0 && color_sum > 3000) //here is the value to change for a different noise reduction strength -3060
        {
            i = i - 2;
            pixels[i] = 0;
            pixels[i+1] = 0;
            pixels[i+2] = 255;
            pixels[i+3] = 255;
            i = i + 2;
        }
    }
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
    var grays = new Array();

    // Avoir un tableau des valeurs grayscale de chaque pixel
    for (i = 0; i < pixels.length; i = i + 4)
    {
        grays.push(pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114);
    }

    var corners = tracking.Fast.findCorners(grays, width, height, 100);

    for (i = 0; i < corners.length; i = i + 2)
    {
        var k = (corners[i] * corners[i + 1] + corners[i]) * 4;
        pixels[k] = 255;
        pixels[k + 1] = 192;
        pixels[k + 2] = 192;
        pixels[k + 3] = 192;
    }
    return pixels;
}
/*
** END CORNERS DETECTION
*/
