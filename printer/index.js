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

const PDFDocument = require('pdfkit');
const fs = require('fs');

app.post('/print', upload, (req, res) => {
    // create pdf

    const doc = new PDFDocument({ size: [288, 432] });
    doc.pipe(fs.createWriteStream('media/printme.pdf'));
    doc.image('media/photo', {
        x: 0,
        y: 0,
        fit: [288, 432],
        align: 'center',
        valign: 'center'
    });
    doc.addPage();
    doc.image('media/qr.jpg', {
        x: 44,
        y: 116,
        fit: [200, 200],
        align: 'center',
        valign: 'center',
    });
    doc.end();

    // run python script
    spawn('python', ['./print.py']);
})

app.listen(port, () => {
    console.log(`server listening on port ${port}.`);
})