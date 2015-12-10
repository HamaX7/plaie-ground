/*
** BEGIN CONVERSION RGBA -> HSV
*/
function isOnePointZero(n)
{
    return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
};

function isPercentage(n)
{
    return typeof n === "string" && n.indexOf('%') != -1;
};

function bound01(n, max)
{
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

function rgbToHsv(r, g, b)
{
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if(max == min)
    {
        h = 0; // achromatic
    }
    else
    {
        switch(max)
        {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h, s: s, v: v };
};
/*
** END CONVERSION RGBA -> HSV
*/
