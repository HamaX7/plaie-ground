var c = document.getElementById( "image-plaie" );
var ctx = c.getContext("2d");
var HEIGHT = 400;

var imgPlaie = new Image();
imgPlaie.src = "plaie.jpg";

imgPlaie.onload = function(){

    imgPlaie.width *= HEIGHT / imgPlaie.height;
    imgPlaie.height = HEIGHT;

    ctx.clearRect(0, 0, c.width, c.height);
    c.width = imgPlaie.width;
    c.height = imgPlaie.height;
    ctx.drawImage(imgPlaie, 0, 0, imgPlaie.width, imgPlaie.height);

	var copie_imgPlaie = ctx.getImageData( 0, 0, imgPlaie.width, imgPlaie.height);
	var pixels = copie_imgPlaie.data;

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
    //basic Noise reduction for red
    for (i = 0; i < pixels.length; i = i + 4)
    {
        var color_sum = pixels[i - 4]
                        + pixels[i + 4]
                        + pixels[i - 8]
                        + pixels[i + 8]
                        + pixels[i - (4 * copie_imgPlaie.width)]
                        + pixels[i + (4 * copie_imgPlaie.width)]
                        + pixels[i - (4 * copie_imgPlaie.width) - 4]
                        + pixels[i - (4 * copie_imgPlaie.width) + 4]
                        + pixels[i - (4 * copie_imgPlaie.width) - 8]
                        + pixels[i - (4 * copie_imgPlaie.width) + 8]
                        + pixels[i + (4 * copie_imgPlaie.width) - 4]
                        + pixels[i + (4 * copie_imgPlaie.width) + 4]
                        + pixels[i + (4 * copie_imgPlaie.width) - 8]
                        + pixels[i + (4 * copie_imgPlaie.width) + 8]
                        + pixels[i - (4 * 2 * copie_imgPlaie.width)]
                        + pixels[i - (4 * 2 * copie_imgPlaie.width) - 4]
                        + pixels[i - (4 * 2 * copie_imgPlaie.width) + 4]
                        + pixels[i - (4 * 2 * copie_imgPlaie.width) - 8]
                        + pixels[i - (4 * 2 * copie_imgPlaie.width) + 8]
                        + pixels[i + (4 * 2 * copie_imgPlaie.width)]
                        + pixels[i + (4 * 2 * copie_imgPlaie.width) - 4]
                        + pixels[i + (4 * 2 * copie_imgPlaie.width) + 4]
                        + pixels[i + (4 * 2 * copie_imgPlaie.width) - 8]
                        + pixels[i + (4 * 2 * copie_imgPlaie.width) + 8];
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
    //basic Noise reduction for blue
    for (i = 2; i < pixels.length; i = i + 4)
    {
        color_sum = pixels[i - 4]
                    + pixels[i + 4]
                    + pixels[i - 8]
                    + pixels[i + 8]
                    + pixels[i - (4 * copie_imgPlaie.width)]
                    + pixels[i + (4 * copie_imgPlaie.width)]
                    + pixels[i - (4 * copie_imgPlaie.width) - 4]
                    + pixels[i - (4 * copie_imgPlaie.width) + 4]
                    + pixels[i - (4 * copie_imgPlaie.width) - 8]
                    + pixels[i - (4 * copie_imgPlaie.width) + 8]
                    + pixels[i + (4 * copie_imgPlaie.width) - 4]
                    + pixels[i + (4 * copie_imgPlaie.width) + 4]
                    + pixels[i + (4 * copie_imgPlaie.width) - 8]
                    + pixels[i + (4 * copie_imgPlaie.width) + 8]
                    + pixels[i - (4 * 2 * copie_imgPlaie.width)]
                    + pixels[i - (4 * 2 * copie_imgPlaie.width) - 4]
                    + pixels[i - (4 * 2 * copie_imgPlaie.width) + 4]
                    + pixels[i - (4 * 2 * copie_imgPlaie.width) - 8]
                    + pixels[i - (4 * 2 * copie_imgPlaie.width) + 8]
                    + pixels[i + (4 * 2 * copie_imgPlaie.width)]
                    + pixels[i + (4 * 2 * copie_imgPlaie.width) - 4]
                    + pixels[i + (4 * 2 * copie_imgPlaie.width) + 4]
                    + pixels[i + (4 * 2 * copie_imgPlaie.width) - 8]
                    + pixels[i + (4 * 2 * copie_imgPlaie.width) + 8];
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


	// copie le résultat après l'original
    var grays = new Array();
    // Avoir un tableau des valeurs grayscale de chaque pixel
    for (i = 0; i < pixels.length; i = i + 4)
    {
        grays.push(pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114);
    }

    // Trouve les coins dans l'image
    var corners = tracking.Fast.findCorners(grays, imgPlaie.width, imgPlaie.height, 100);

    for (i = 0; i < corners.length; i = i + 2)
    {
        var k = (corners[i] * corners[i + 1] + corners[i]) * 4;
        pixels[k] = 255;
        pixels[k + 1] = 0;
        pixels[k + 2] = 0;
        pixels[k + 3] = 255;
        //console.log(pixels[k]);
        //console.log(pixels[k + 1]);
        //console.log(pixels[k + 2]);
    }
    copie_imgPlaie.data = pixels;
	// Copie le résultat en-dessous de l'original

    var copie = document.getElementById( "copie" );
    copie.width = imgPlaie.width;
    copie.height = imgPlaie.height;
    var ctxCopie = copie.getContext("2d");
	ctxCopie.putImageData(copie_imgPlaie, 0, 0);
}


function isOnePointZero(n) {
    return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
};
function isPercentage(n) {
    return typeof n === "string" && n.indexOf('%') != -1;
};
function bound01(n, max) {
    if (isOnePointZero(n)) { n = "100%"; }
    var processPercent = isPercentage(n);
    n = Math.min(max, Math.max(0, parseFloat(n)));
    if (processPercent) {
        n = parseInt(n * max, 10) / 100;
    }
    if ((Math.abs(n - max) < 0.000001)) {
        return 1;
    }
    return (n % max) / parseFloat(max);
};
function rgbToHsv(r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if(max == min) {
        h = 0; // achromatic
    }
    else {
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h, s: s, v: v };
};
