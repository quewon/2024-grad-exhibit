const express = require('express');
const path = require('path');
const port = 3000;
const app = express();

//

app.use('/', express.static(path.join(__dirname, '/public')));
    // use form data
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile('public/index.html')
})

app.listen(port, () => {
    console.log(`server listening on port ${port}.`)
})