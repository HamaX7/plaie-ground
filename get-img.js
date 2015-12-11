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
        pixelsColorProcessing(pixels, copie_imgPlaie.width);

        // Corners detection on copy
        var corners = cornerDetection(pixels, copie_imgPlaie.width, copie_imgPlaie.height);

        // Paint bucket
        paintBucket(pixels, copie_imgPlaie.width, copie_imgPlaie.height, 0, 0);

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

        /*console.log("### width = " + width + " ### height = " + height);
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
        }*/
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
** BEGIN BLACK TO WHITE
*/
function paintBucket(pixels, width, height, xstart, ystart)
{
    var pixelStack = [[xstart, ystart]];

    while (pixelStack.length)
    {
      var newPos, x, y, pixelPos, reachLeft, reachRight;
      newPos = pixelStack.pop();
      x = newPos[0];
      y = newPos[1];

      pixelPos = (y * width + x) * 4;
      while (y-- >= 0 && matchStartColor(pixels, pixelPos))
      {
        pixelPos -= width * 4;
      }
      pixelPos += width * 4;
      ++y;
      reachLeft = false;
      reachRight = false;
      while (y++ < height - 1 && matchStartColor(pixels, pixelPos))
      {
        colorPixel(pixels, pixelPos);

        if (x > 0)
        {
          if (matchStartColor(pixels, pixelPos - 4))
          {
            if (!reachLeft)
            {
              pixelStack.push([x - 1, y]);
              reachLeft = true;
            }
          }
          else if (reachLeft)
          {
            reachLeft = false;
          }
        }
        if (x < width - 1)
        {
          if (matchStartColor(pixels, pixelPos + 4))
          {
            if (!reachRight)
            {
              pixelStack.push([x + 1, y]);
              reachRight = true;
            }
          }
          else if (reachRight)
          {
            reachRight = false;
          }
        }
        pixelPos += width * 4;
      }
    }
    pixels[(ystart * width + xstart) * 4] = 255;
    pixels[(ystart * width + xstart) * 4 + 1] = 255;
    pixels[(ystart * width + xstart) * 4 + 2] = 0;
    pixels[(ystart * width + xstart) * 4 + 3] = 255;

    // Black to red
    for (i = 0; i < pixels.length; i = i + 4)
    {
        if (pixels[i] + pixels[i + 1] + pixels[i + 2] == 0)
        {
            pixels[i] = 255;
            pixels[i + 1] = 0;
            pixels[i + 2] = 0;
            pixels[i + 3] = 255;
        }
    }

    function matchStartColor(pixels, pixelPos)
    {
      return (pixels[pixelPos] == 0 &&
            pixels[pixelPos+1] == 0 &&
            pixels[pixelPos+2] == 0);
    }

    function colorPixel(pixels, pixelPos)
    {
      pixels[pixelPos] = 255;
      pixels[pixelPos+1] = 255;
      pixels[pixelPos+2] = 255;
      pixels[pixelPos+3] = 255;
    }
}
/*
** END BLACK TO WHITE
*/
