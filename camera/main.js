var video = document.querySelector("video");
var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");

var qr_engine = QrScanner.createQrEngine(QrScanner.WORKER_PATH);
var reusable_canvas = document.createElement("canvas");

var codes_history = {};

function init_camera() {
    // Use facingMode: environment to attempt to get the front camera on phones
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } }).then(function(stream) {
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

    window.onresize = () => {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
    }
}

function drawQuad(points) {
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    context.lineTo(points[1].x, points[1].y);
    context.lineTo(points[2].x, points[2].y);
    context.lineTo(points[3].x, points[3].y);
    context.closePath();
}

async function tick() {
    // context.drawImage(video, 0, 0, canvas.width, canvas.height);

    context.fillStyle = "white";

    var codes = {};
    
    do {
        var result = await QrScanner.scanImage(canvas, {
            canvas: reusable_canvas,
            qrEngine: qr_engine
        }).catch(error => {});
        if (typeof result != "undefined") {
            drawQuad(result.cornerPoints);
            context.fill();
            codes[result.data] = result.cornerPoints;
        }
    } while (typeof result != "undefined")

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    context.fillStyle = context.strokeStyle = "#FF3B58";
    context.lineWidth = 5;
    var now = new Date();

    for (let code in codes) {
        let points = codes[code];
        drawQuad(points);
        context.stroke();

        if (!codes_history[code]) {
            codes_history[code] = {};
        }
        codes_history[code].previous_position = codes_history[code].position;
        codes_history[code].position = {
            x: (points[1].x + points[3].x) / 2,
            y: (points[1].y + points[3].y) / 2
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