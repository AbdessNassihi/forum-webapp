const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path')

const PORT = 3000;
const app = express();
const userEndpoints = require('./endpoints/user');
app.use(express.json());
app.use('/users', userEndpoints);
app.use('/', (req, res) => { res.send({ message: 'server is oke' }) });
app.all('*', (req, res) => { res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Endpoint not in server' } }) });



const options = {
    key: fs.readFileSync(path.resolve(__dirname, '../cert/key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '../cert/cert.pem'))
};
const server = https.createServer(options, app);
server.listen(PORT, () => {
    console.log('Server listening on port 3000');
});
