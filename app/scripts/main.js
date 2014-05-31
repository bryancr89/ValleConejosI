function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();
        if (!f.type.match('image.*')) {
            continue;
        }
        // Closure to capture the file information.
        reader.onload = (function (file) {
            return function (e) {
                e.stopPropagation();
                e.preventDefault();
                // Render thumbnail.
                var span = document.createElement('span');
                span.innerHTML = ['<img id="img-to-filter" class="thumb" src="', e.target.result,
                    '" title="', escape(file.name), '"/>'].join('');
                document.getElementById('drop-zone').innerHTML = span.innerHTML;
            };
        })(f);
        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

function filter(imgObj, method) {
    var canvas = document.createElement('canvas');
    var canvasContext = canvas.getContext('2d');

    var imgW = imgObj.width;
    var imgH = imgObj.height;
    canvas.width = imgW;
    canvas.height = imgH;

    canvasContext.drawImage(imgObj, 0, 0);
    var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);

    imgPixels = method === 'sepia' ? sepiaFilter(imgPixels) : grayFilter(imgPixels);
    canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
    return canvas.toDataURL();
}

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

$(function () {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var dropZone = document.getElementById('drop-zone');
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', handleFileSelect, false);
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }

    $('#grayscale').click(function () {
        var imgObj = document.getElementById('img-to-filter');
        imgObj.src = filter(imgObj, 'grayscale');
    });

    $('#sepia').click(function () {
        var imgObj = document.getElementById('img-to-filter');
        imgObj.src = filter(imgObj, 'sepia');
    });
});