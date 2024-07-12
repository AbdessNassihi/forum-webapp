const express = require('express');
const router = express.Router();

const database = require('../../db/dbconnection');
const { USER_QUERY: QUERY } = require('../../db/query');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const path = require('path');

const { check, validationResult } = require('express-validator');
const { upload, getImagePath } = require('../imagesUtils');



// Selecting all users
router.get('/', async (req, res) => {

    try {
        const [rows] = await database.query(QUERY.SELECT_USERS);
        if (rows.length > 0) {
            res.status(200).json({ code: 200, status: 'OK', message: 'Users retrieved successfully', data: rows });
        } else {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'No users found' } });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error retrieving while users', log: error.message } });
    }
});

// Selecting a specefic user
router.get('/:id', async (req, res) => {
    try {
        const iduser = parseInt(req.params.id);
        const [rows] = await database.query(QUERY.SELECT_USER, iduser);
        if (rows.length > 0) {
            res.status(200).json({ code: 200, status: 'OK', message: 'User retrieved successfully', data: rows[0] });
        } else {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'User not found' } });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error retrieving user', log: error.message } });
    }

});

// Retrieving profile image of an user
router.get('/images/:id', async (req, res) => {

    try {
        const iduser = parseInt(req.params.id);
        const [rows] = await database.query(QUERY.SELECT_USER, iduser);
        if (!rows[0]) {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Image not found' } });
        } else {
            res.sendFile(path.join('/usr/code', rows[0].img_url));
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error retrieving image of user', log: error.message } });
    }

});


// Deleting a user
router.delete('/:id', async (req, res) => {
    try {
        const iduser = parseInt(req.params.id);
        const [rows] = await database.query(QUERY.SELECT_USER, iduser);
        if (!rows[0]) {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'User not found' } });
        } else {
            const result = await database.query(QUERY.DELETE_USER, [iduser]);
            if (result) {
                res.status(200).json({ code: 200, status: 'OK', message: 'User deleted successfully' });
            } else {
                res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error deleting user' } });
            }
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error deleting user', log: error.message } });
    }
});


/* UPDATING THE PROFILE */

// Updating the username
router.put('/:id/username', [
    check('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ code: 400, status: 'Bad Request', errors: errors.array() });
    }
    try {
        const iduser = parseInt(req.params.id);
        const { username } = req.body;
        const result = await database.query(QUERY.UPDATE_USERNAME, [username, iduser]);

        res.status(200).json({ code: 200, status: 'OK', message: 'Username updated successfully', data: result });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: { code: 400, status: 'Bad Request', message: 'Username already used' } });
        } else {
            res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error updating username', log: error.message } });
        }
    }
});

// Updating the user text
router.put('/:id/textuser', async (req, res) => {
    try {
        const iduser = parseInt(req.params.id);
        const { textuser } = req.body;

        const result = await database.query(QUERY.UPDATE_TEXTUSER, [textuser, iduser]);

        res.status(200).json({ code: 200, status: 'OK', message: 'Text user updated successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error updating text user', log: error.message } });
    }
});

// Updating the password
router.put('/:id/password', [
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ code: 400, status: 'Bad Request', errors: errors.array() });
    }

    try {
        const iduser = parseInt(req.params.id);
        const { password } = req.body;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const result = await database.query(QUERY.UPDATE_PASSWORD, [hashedPassword, salt, iduser]);

        res.status(200).json({ code: 200, status: 'OK', message: 'Password updated successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error updating password', log: error.message } });
    }
});

// updating the profile image
router.put('/:id/image', (req, res, next) => {
    upload.single('profileImage')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ code: 400, status: 'Bad Request', message: err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        const iduser = parseInt(req.params.id, 10);
        const [rows] = await database.query(QUERY.SELECT_USER, [iduser]);
        if (!rows[0]) {
            return res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'User not found' } });
        }

        const imagePath = getImagePath(req, rows[0]);

        const result = await database.query(QUERY.UPDATE_IMAGE, [imagePath, iduser]);

        res.status(200).json({ code: 200, status: 'OK', message: 'Profile image updated successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error updating profile image', log: error.message } });
    }
});




router.post('/follow/:id', async (req, res) => {

    const iduser = req.body.iduser;
    const [rows] = await database.query(QUERY.SELECT_USER, iduser);
    if (!rows[0]) {
        res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'User not found' } });
    }
    try {
        const follower_id = parseInt(req.params.id);
        const result = await database.query(QUERY.NEW_FOLLOW, [follower_id, iduser])
        if (result) {
            res.status(201).json({ code: 201, status: 'Created', message: 'User is following the requested user', data: result });
        }
        else {
            res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error following the user' } });
        }

    } catch {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error following the user', log: error } });
    }
});





module.exports = router;