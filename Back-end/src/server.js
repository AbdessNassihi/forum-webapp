const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path')

const PORT = 3000;
const app = express();
app.use(express.json());
app.use('/', (req, res) => { res.send({ message: 'test ssl server is oke' }) });

const options = {
    key: fs.readFileSync(path.resolve(__dirname, '../cert/key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '../cert/cert.pem'))
};
const server = https.createServer(options, app);
server.listen(PORT, () => {
    console.log('Server listening on port 3000');
});
