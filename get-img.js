(function()
{
    var app = angular.module('plaieground', []);

    app.controller('GetimgController', function()
    {
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
        }

        console.log("check");
        var image = document.getElementById("image-src");
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.length = image.length;
        var context = canvas.getContext('2d');
        
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
            var hsv = rgbToHsv(pixels[i], pixels[i + 1], pixels[i + 2]);
            if (hsv['h'] > 0.44 && hsv['h'] < 0.55
                && hsv['s'] > 0.2 && hsv['s'] < 0.8
                && hsv['v'] > 0.2 && hsv['v'] < 0.8)
            {
                pixels[i] = 0;
                pixels[i+1] = 0;
                pixels[i+2] = 0;
                pixels[i+3] = 255;
            }
            else
            {
                pixels[i] = 255;
                pixels[i+1] = 255;
                pixels[i+2] = 255;
                pixels[i+3] = 255;
            }
        }
        /*for (i = 0; i < (5 * 4); i += 4) {
            console.log(pixels[i]);
            console.log(pixels[i+1]);
            console.log(pixels[i+2]);
        }*/
        
        context.drawImage(image, 0, 0);
        var img = document.createElement("img");
        img.src = canvas.toDataURL("image/png");
        document.body.appendChild(img);
    });
})();

