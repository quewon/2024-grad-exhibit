const express = require('express');
const compression = require('compression');
const path = require('path');
const cors = require('cors');
const sqlite = require('./js/sqlite.js');

const port = process.env.PORT || 8080;
const app = express();
const server = require('http').createServer(app);

//

const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', socket => {
    socket.on('request_photos', () => {
        socket.emit('photos', sqlite.queryall("photos", {}));
    })

    socket.on('update_position', data => {
        console.log(data);
        sqlite.update("photos", {
            photo_id: data.photo_id
        }, {
            position: data.position
        });
        io.emit('position_update', sqlite.queryall("photos", {}));
    })

    socket.on('print_success', photo_id => {
        sqlite.update("photos", {
            photo_id: photo_id
        }, {
            printed: 1
        });
    })
});

//

app.use(cors());
app.use(compression({ level: 1 }));
app.use('/photos', express.static(path.join(__dirname, 'photos')));
app.use('/', express.static(path.join(__dirname, 'public')));
    // use form data
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

//

const multer = require('multer');
const upload = multer({
    dest: 'photos/'
}).single('file');

app.post('/upload', (req, res) => {
    upload(req, res, err => {
        if (err) {
            if (err instanceof multer.MulterError) {
                res.send({
                    message: err.message
                })
            }
        } else {
            try {
                // add to database
                sqlite.insert("photos", {
                    path: req.file.path,
                    position: "{x:null}"
                })

                io.emit('photos', sqlite.queryall("photos", {}));

                res.send({
                    message: 'success',
                    path: req.file.path
                })
            }
            catch {
                res.send({
                    message: 'error'
                });
            }
        }
    })
})

app.get('/photos', (req, res) => {
    var photos_object = sqlite.queryall("photos", {});
    res.send({ body: photos_object });
})

server.listen(port, () => {
    console.log(`server listening on port ${port}.`);
})