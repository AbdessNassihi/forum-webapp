const express = require('express');
//onst https = require('https');
const http = require('http'); // Use HTTP instead of HTTPS
const cors = require('cors')

const session = require('express-session');
const sessionStore = require('./session_store');
const passport = require('passport');

//const fs = require('fs');
//const path = require('path');

const PORT = 8000;
const app = express();

const userEndpoints = require('./endpoints/user');
const authEndpoints = require('./endpoints/auth');
const threadEndpoints = require('./endpoints/thread');
const postEndpoints = require('./endpoints/post');
const commentEnpoints = require('./endpoints/comments');
const subscriptionEndpoints = require('./endpoints/subscription');
const followEndpoints = require('./endpoints/follow');


app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:3000', // Your frontend's origin
    credentials: true, // This allows the server to accept cookies from the client
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));


/* USER SESSION */
app.use(session({
    secret: 'secret-cookie',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 * 60, }
})
);
app.use(passport.initialize());
app.use(passport.session());

/* ENDPOINTS */
app.use('/auth', authEndpoints);
app.use('/users', userEndpoints);
app.use('/threads', threadEndpoints);
app.use('/posts', postEndpoints);
app.use('/comments', commentEnpoints);
app.use('/subscription', subscriptionEndpoints);
app.use('/follow', followEndpoints);
app.get('/status', (req, res) => {
    res.status(200).json({ status: 'Server is running' });
});
app.all('*', (req, res) => { res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Endpoint not in server' } }) });



/* commented out since not working with axios
const options = {
    key: fs.readFileSync(path.resolve(__dirname, '../cert/key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '../cert/cert.pem'))
};
const server = https.createServer(options, app);
*/

const server = http.createServer(app); // Create HTTP server
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
