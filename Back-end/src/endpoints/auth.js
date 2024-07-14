const express = require('express');
const router = express.Router();

const passport = require('../auth_strategy');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const { validationResult } = require('express-validator');
const { validateUsernameReq, validatePasswordReq, validateAllReq } = require('../input_validation');
const { handleImageUpload, getImagePath } = require('../imagesUtils');

const database = require('../../db/dbconnection');
const { USER_QUERY: QUERY } = require('../../db/query');




/* USER AUTHENTICATION AND SESSION MANAGEMENT  */
router.post('/login', passport.authenticate('local'), (req, res) => {
    return res.status(200).json({ code: 200, status: 'OK', message: 'Authentication succeed' });
});

router.post('/logout', (req, res) => {
    if (!req.user) return res.status(401).json({ code: 401, status: 'Unauthorized', message: 'User not authenticated' });
    req.logout((error) => {
        if (error) return res.status(400).json({ error: { code: 400, status: 'Bad Request', message: 'Logout failed' } });
        return res.status(200).json({ code: 200, status: 'OK', message: 'User is Logged Out' });
    })

});

router.get('/status', (req, res) => {
    if (req.user) return res.status(200).json({ code: 200, status: 'ok', message: 'User is authenticated', user: req.user });
    return res.status(401).json({ code: 401, status: 'Unauthorized', message: 'User not authenticated' });
});



/*USER REGISTRATION*/
router.post('/register', validateAllReq, handleImageUpload, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(400).json({ code: 400, status: 'Bad Request', errors: errors.array() }); }

    try {
        const { username, email, password, is_admin, textuser } = req.body;
        const imagePath = getImagePath(req, null);
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const result = await database.query(QUERY.NEW_USER, [username, email, hashedPassword, is_admin, imagePath, textuser, salt]);

        return res.status(201).json({ code: 201, status: 'Created', message: 'User created successfully', data: result });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            const field = error.sqlMessage.includes('username') ? 'Username' : 'Email';
            return res.status(400).json({ error: { code: 400, status: 'Bad Request', message: `${field} already used` } });
        } else {
            return res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error creating user', log: error.message } });
        }
    }
});




module.exports = router;
