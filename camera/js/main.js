var video = document.querySelector("video");
var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");

var codes_history = {};

function init_camera() {
    window.onresize = () => {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
    }
    
    // Use facingMode: environment to attempt to get the front camera on phones
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
        video.srcObject = stream;
        video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
        video.play();

        console.log("loading video...");

        video.addEventListener("loadeddata", () => {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                window.onresize();

                console.log("starting feed!");

                tick();
            }
        });
    });
}

function drawQuad(location) {
    context.beginPath();
    context.moveTo(location.topLeftCorner.x, location.topLeftCorner.y);
    context.lineTo(location.topRightCorner.x, location.topRightCorner.y);
    context.lineTo(location.bottomRightCorner.x, location.bottomRightCorner.y);
    context.lineTo(location.bottomLeftCorner.x, location.bottomLeftCorner.y);
    context.closePath();
}

function tick() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    context.fillStyle = "white";

    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var codes = {};

    for (let i=0; i<35; i++) {
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });
        if (code && code.data != '') {
            drawQuad(code.location);
            context.fill();
            codes[code.data] = code.location;
        } else {
            break;
        }
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    context.fillStyle = context.strokeStyle = "#FF3B58";
    context.lineWidth = 5;
    var now = new Date();

    for (let code in codes) {
        let location = codes[code];
        drawQuad(location);
        context.stroke();

        if (!codes_history[code]) {
            codes_history[code] = {};
        }
        codes_history[code].previous_position = codes_history[code].position;
        codes_history[code].position = {
            x: (location.topLeftCorner.x + location.bottomRightCorner.x) / 2,
            y: (location.topLeftCorner.y + location.bottomRightCorner.y) / 2
        }
        codes_history[code].last_updated = now;
    }

    context.fillStyle = context.strokeStyle = "blue";

    for (let code in codes_history) {
        let data = codes_history[code];
        if (now - data.last_updated <= 1500) {
            context.beginPath();
            context.arc(data.position.x, data.position.y, 5, 0, Math.PI*2);
            context.fill();

            if (data.previous_position) {
                let prev = data.previous_position;
                if (
                    Math.floor(data.position.x) != Math.floor(prev.x) &&
                    Math.floor(data.position.y) != Math.floor(prev.y)
                ) {
                    update_position(code, data.position);
                }
            }
        } else {
            socket.emit('update_position', { photo_id: code.replace("DG_", ""), position: "{x:null}" });
            delete codes_history[code];
        }
    }

    requestAnimationFrame(tick);
}

function update_position(photo_id, position) {
    photo_id = photo_id.replace("DG_", "");
    position = `{x:${1 - (position.x / canvas.width)},y:${position.y / canvas.height}}`
    socket.emit('update_position', { photo_id, position })
}