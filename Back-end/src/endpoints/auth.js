const express = require('express');
const router = express.Router();

const passport = require('../auth_strategy');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const { check, validationResult } = require('express-validator');
const { handleImageUpload, getImagePath } = require('../imagesUtils');

const database = require('../../db/dbconnection');
const { USER_QUERY: QUERY } = require('../../db/query');




// user login
router.post('/login', passport.authenticate('local', { failureRedirect: 'auth/login/failure' }), (req, res) => {

    res.status(200).json({ code: 200, status: 'OK', message: 'Authentication succeed' });
});

router.get('/login/failure', (req, res) => {
    res.status(401).json({ code: 401, status: 'Unauthorized', message: 'Authentication failed' });
})


// user registration
router.post('/register', [
    check('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    check('email').isEmail().withMessage('Invalid email format'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], handleImageUpload, async (req, res) => {

    const errors = validationResult(req.body);
    if (!errors.isEmpty()) { return res.status(400).json({ code: 400, status: 'Bad Request', errors: errors.array() }); }

    try {
        const { username, email, password, is_admin, textuser } = req.body;
        const imagePath = getImagePath(req, null);
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const result = await database.query(QUERY.NEW_USER, [username, email, hashedPassword, is_admin, imagePath, textuser, salt]);

        res.status(201).json({ code: 201, status: 'Created', message: 'User created successfully', data: result });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            const field = error.sqlMessage.includes('username') ? 'Username' : 'Email';
            res.status(400).json({ error: { code: 400, status: 'Bad Request', message: `${field} already used` } });
        } else {
            res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error creating user', log: error.message } });
        }
    }
});




module.exports = router;
