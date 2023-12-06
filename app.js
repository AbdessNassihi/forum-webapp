const express = require('express');
const https = require('https');
const fs = require('fs');

const app = express();
app.use('/', (req, res, next) => { res.send('test ssl server is oke') });

const options = {
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem')
};
const server = https.createServer(options, app);
server.listen(443, () => {
    console.log('Server listening on port 443');
});
