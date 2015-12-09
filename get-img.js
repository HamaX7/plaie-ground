(function()
{
    var app = angular.module('plaieground', []);

    app.controller('GetimgController', function()
    {
        console.log("check");
        var image = document.getElementById("image-src");
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.length = image.length;
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        var imgData = context.getImageData(0, 0, image.width, image.height);
        var pixels = imgData.data;
        var hsvPixels = new Array();

        // pixels contient les valeurs RGBA (red, green, blue, alpha chanel ou transparence)
        // de chaque pixel (ex: pixel 1 = pixels[0], pixels[1], pixels[2] et pixels[3])
        //var rgbaPixels = new Array();
        /*var heightPixels = imgData.height; // Hauteur en nombre de pixels
        var widthPixels = imgData.width; // Largeur en nombre de pixels
        var nbPixels = widthPixels * heightPixels;*/
        for (i = 0; i < pixels.length; i = i + 4)
        {
            hsvPixels.push(rgbToHsv(pixels[i], pixels[i + 1], pixels[i + 2]));
            /*var rgba = new Array();
            rgba.push(pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]);
            rgbaPixels.push(rgba);*/
        }
        for (i = 0; i < 10; i++) {
            console.log(hsvPixels[i]);
        }
    });
})();


function rgbToHsv(r, g, b)
{
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = math.max(r, g, b), min = math.min(r, g, b);
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
}