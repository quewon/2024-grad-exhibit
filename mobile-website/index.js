const express = require('express');
const compression = require('compression');
const path = require('path');
const sqlite = require('./js/sqlite.js');

const port = parseInt(process.env.PORT) || 8080;
const app = express();

//

// const printer = require('printer');
// console.log( printer.getPrinters() );

//

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(compression({ level: 1 }));
app.use('/photos', express.static(path.join(__dirname, 'photos')));
app.use('/', express.static(path.join(__dirname, 'public')));
    // use form data
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile('public/index.html')
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
                var result = sqlite.insert("photos", {
                    path: req.file.path,
                    position: "{x:0, y:0}"
                })

                var photo_id = result.lastInsertRowid;

                // print

                res.send({
                    message: 'success',
                    photo_id: photo_id,
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

app.post('/update', upload, (req, res) => {
    for (let data of JSON.parse(req.body.photos)) {
        sqlite.update("photos", {
            photo_id: data.photo_id
        }, {
            position: data.position
        });
    }
})

app.get('/photos', (req, res) => {
    var photos_object = sqlite.queryall("photos", {});
    res.send({ body: photos_object });
})

app.listen(port, () => {
    console.log(`server listening on port ${port}.`);
})