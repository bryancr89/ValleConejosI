onmessage = function (oEvent) {
    var data = oEvent.data.type === 'grayscale' ? grayFilter(oEvent.data.pixels) : sepiaFilter(oEvent.data.pixels);
    postMessage(data);
};

function grayFilter(imgPixels) {
    for (var y = 0; y < imgPixels.height; y++) {
        for (var x = 0; x < imgPixels.width; x++) {
            var i = (y * 4) * imgPixels.width + x * 4;
            var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
            imgPixels.data[i] = avg;
            imgPixels.data[i + 1] = avg;
            imgPixels.data[i + 2] = avg;
        }
    }
    return imgPixels;
}

function sepiaFilter(imgPixels) {
    for (var y = 0; y < imgPixels.height; y++) {
        for (var x = 0; x < imgPixels.width; x++) {
            var i = (y * 4) * imgPixels.width + x * 4,
                red = imgPixels.data[i],
                green = imgPixels.data[i + 1],
                blue = imgPixels.data[i + 2];
            imgPixels.data[i] = (red * 0.393) + (green * 0.769) + (blue * 0.189);
            imgPixels.data[i + 1] = (red * 0.349) + (green * 0.686) + (blue * 0.168);
            imgPixels.data[i + 2] = (red * 0.272) + (green * 0.534) + (blue * 0.131);
        }
    }
    return imgPixels;
}
