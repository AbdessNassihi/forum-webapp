const express = require('express');
const router = express.Router();

const passport = require('../auth_strategy');

const bcrypt = require('bcrypt');
const saltRounds = 10;


const { validateAllReq } = require('../input_validation');
const { getImagePath } = require('../imagesUtils');

const database = require('../../db/dbconnection');
const { USER_QUERY: QUERY } = require('../../db/query');




/* USER AUTHENTICATION AND SESSION MANAGEMENT */

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ code: 500, status: 'Error', message: 'An error occurred during authentication' });
        }
        if (!user) {
            let errors = [];
            errors.push({ path: `${info.path}`, msg: `${info.msg}` });
            return res.status(401).json({ code: 401, status: 'Unauthorized', errors: errors });
        }

        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ code: 500, status: 'Error', message: 'Login failed' });
            }
            return res.status(200).json({ code: 200, status: 'OK', message: 'Authentication succeeded', user: user });
        });
    })(req, res, next);
});


router.get('/logout', (req, res) => {
    if (!req.user) return res.status(401).json({ code: 401, status: 'Unauthorized', message: 'User not authenticated' });
    req.logout((error) => {
        if (error) return res.status(400).json({ code: 400, status: 'Bad Request', message: 'Logout failed' });
        res.status(200).json({ code: 200, status: 'OK', message: 'You have been logged out' });
    })

});

router.get('/status', (req, res) => {
    if (req.user) return res.status(200).json({ code: 200, status: 'ok', message: 'User is authenticated', user: req.user });
    res.status(401).json({ code: 401, status: 'Unauthorized', message: 'User is not authenticated' });
});



/*USER REGISTRATION*/
router.post('/register', validateAllReq, async (req, res) => {

    try {
        const count = await database.query(QUERY.COUNT_USERS);
        const is_admin = count[0][0].userCount == 0 ? 1 : 0;
        const { username, email, password, textuser } = req.body;
        const imagePath = getImagePath(req, null, true);
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const result = await database.query(QUERY.NEW_USER, [email, username, hashedPassword, is_admin, imagePath, textuser, salt]);

        if (!result[0].affectedRows) throw new Error('User registration failed');
        return res.status(201).json({ code: 201, status: 'Created', message: 'User registered successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            let errors = [];
            const field = error.sqlMessage.includes('username') ? 'username' : 'email';
            errors.push({ path: `${field}`, msg: `${field} already used` });
            return res.status(400).json({ code: 400, status: 'Bad Request', errors: errors });
        } else {
            return res.status(500).json({ code: 500, status: 'Internal Server Error', message: 'Error while registering user', log: error.message });
        }
    }
});



module.exports = router;
