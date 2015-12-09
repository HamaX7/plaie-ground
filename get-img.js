(function()
{
    var app = angular.module('plaieground', []);

    app.controller('GetimgController', function()
    {
        var image = document.getElementById("image-src");
        var canvas = document.createElement('canvas');
        this.test = image.width;
        canvas.width = image.width;
        canvas.length = image.length;
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        var imgData = context.getImageData(0, 0, image.width, image.height);
        var pixels = imgData.data;
        // pixels contient les valeurs RGBA (red, green, blue, alpha chanel ou transparence)
        // de chaque pixel (ex: pixel 1 = pixels[0], pixels[1], pixels[2] et pixels[3])
        var rgbaPixels = new Array();
        var heightPixels = imgData.height; // Hauteur en nombre de pixels
        var widthPixels = imgData.width; // Largeur en nombre de pixels
        var nbPixels = widthPixels * heightPixels;
        for (i = 0; i < pixels.length; i = i + 4)
        {
            var rgba = new Array();
            rgba.push(pixels[i], pixels[i + 1], pixels[i + 2]);
            rgbaPixels.push(rgba);
        }
    });
})();
