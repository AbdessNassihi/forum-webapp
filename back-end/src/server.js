const express = require('express');
const http = require('http');
const cors = require('cors')

const session = require('express-session');
const sessionStore = require('./session_store');
const passport = require('passport');



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
    origin: 'http://localhost:3000', // my react-app
    credentials: true,
    optionsSuccessStatus: 200
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

/* THE ENDPOINTS */
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




const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
