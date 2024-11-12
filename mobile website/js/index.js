const express = require('express');
const compression = require('compression');
const path = require('path');
const sqlite = require('./sqlite.js');

const port = process.env.port || 3000;
const app = express();

//

// const printer = require('printer');
// console.log( printer.getPrinters() );

//

app.use(compression({ level: 1 }));
app.use('/photos', express.static(path.join(__dirname, '../photos')));
app.use('/', express.static(path.join(__dirname, '../public')));
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
                var result = sqlite.insert(sqlite.db, "photos", {
                    path: req.file.path
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

app.get('/photos', (req, res) => {
    var photos_object = sqlite.queryall(sqlite.db, "photos", {});
    res.send({ body: photos_object });
})

app.listen(port, () => {
    console.log(`server listening on port ${port}.`)
})