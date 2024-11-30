const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

const { spawn } = require('child_process');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

//

const multer = require('multer');
const storage = multer.diskStorage({
    destination: 'media',
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const upload = multer({ storage }).array('files', 2);

app.post('/print', upload, (req, res) => {
    // run python script
    spawn('python', ['./print.py']);
})

app.listen(port, () => {
    console.log(`server listening on port ${port}.`);
})