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

function initDragDrop(){
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var dropZone = document.getElementById('drop-zone');
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', handleFileSelect, false);
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
}

function filter( imgObj, method ) {
    var canvas = document.createElement('canvas');
    var canvasContext = canvas.getContext('2d');

    var imgW = imgObj.width;
    var imgH = imgObj.height;
    canvas.width = imgW;
    canvas.height = imgH;

    canvasContext.drawImage(imgObj, 0, 0);
    var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);

    var myWorker = new Worker("scripts/image-worker.js");
    myWorker.onmessage = function (oEvent) {
        imgPixels = oEvent.data;
        canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
        imgObj.src = canvas.toDataURL();
    };

    myWorker.postMessage({
        pixels: imgPixels,
        type: method
    });
}

$(function () {
    initDragDrop();

    $('#grayscale').click(function () {
        var imgObj = document.getElementById('img-to-filter');
        if( imgObj === null) {
            alert('Please drag an image');
            return;
        }
        filter(imgObj, 'grayscale');
    });

    $('#sepia').click(function () {
        var imgObj = document.getElementById('img-to-filter');
        if( imgObj === null) {
            alert('Please drag an image');
            return;
        }
        filter(imgObj, 'sepia');
    });
});