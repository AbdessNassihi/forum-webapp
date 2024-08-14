const express = require('express');
const router = express.Router();

const database = require('../../db/dbconnection');
const { USER_QUERY: QUERY } = require('../../db/query');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const path = require('path');

const { validationResult } = require('express-validator');
const { validateUsernameReq, validatePasswordReq } = require('../input_validation');
const { getImagePath, handleImageUpload } = require('../imagesUtils');


/* RETRIEVING AND DELETEING USERS */

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
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while retrieving users', log: error.message } });
    }
});

// Selecting a specefic user
router.get('/:iduser', async (req, res) => {
    console.log('test');
    try {

        const iduser = parseInt(req.params.iduser);
        console.log(iduser);
        const [rows] = await database.query(QUERY.SELECT_USER, [iduser]);
        if (rows.length > 0) {
            res.status(200).json({ code: 200, status: 'OK', message: 'User retrieved successfully', user: rows[0] });
        } else {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'User not found' } });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while retrieving user', log: error.message } });
    }

});

// Retrieving profile image of an user
router.get('/images/:iduser', async (req, res) => {
    try {
        const iduser = parseInt(req.params.iduser);
        const [rows] = await database.query(QUERY.SELECT_USER, [iduser]);
        if (rows.length > 0) {
            res.sendFile(path.join('/usr/code', rows[0].img_url));
        } else {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Image not found' } });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while retrieving image of user', log: error.message } });
    }

});


// Deleting a user
router.delete('/:iduser', async (req, res) => {
    try {
        const iduser = parseInt(req.params.iduser);
        const result = await database.query(QUERY.DELETE_USER, [iduser]);
        if (!result.affectedRows) return res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'User not found' } });
        res.status(200).json({ code: 200, status: 'OK', message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while deleting user', log: error.message } });
    }
});


/* UPDATING THE PROFILE */

// Updating the username
router.put('/username', validateUsernameReq, async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ code: 400, status: 'Bad Request', errors: errors.array() });
    }
    console.log(req.user);
    try {
        const iduser = req.user.iduser;

        const { username } = req.body;
        const result = await database.query(QUERY.UPDATE_USERNAME, [username, iduser]);
        if (!result[0].affectedRows) return res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'User not found' } });
        res.status(200).json({ code: 200, status: 'OK', message: 'Username updated successfully', data: result });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            let errors = [];
            errors.push({ path: 'username', msg: 'username already used' });
            return res.status(400).json({ code: 400, status: 'Bad Request', errors: errors });
        } else {
            res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while updating username', log: error.message } });
        }
    }
});

// Updating the user text
router.put('/textuser', async (req, res) => {
    try {
        const iduser = req.user.iduser;
        const { textuser } = req.body;
        const result = await database.query(QUERY.UPDATE_TEXTUSER, [textuser, iduser]);
        if (!result[0].affectedRows) return res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'User not found' } });
        res.status(200).json({ code: 200, status: 'OK', message: 'Text user updated successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while updating text user', log: error.message } });
    }
});

// Updating the password
router.put('/password', validatePasswordReq, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ code: 400, status: 'Bad Request', errors: errors.array() });
    }
    try {
        const iduser = req.user.iduser;
        const { password } = req.body;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const result = await database.query(QUERY.UPDATE_PASSWORD, [hashedPassword, salt, iduser]);
        if (!result[0].affectedRows) throw new Error('Updating password failed');
        res.status(200).json({ code: 200, status: 'OK', message: 'Password updated successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while updating password', log: error.message } });
    }
});

// updating the profile image
router.put('/image', handleImageUpload, async (req, res) => {
    try {
        const iduser = req.user.iduser;
        const [rows] = await database.query(QUERY.SELECT_USER, [iduser]);
        const imagePath = getImagePath(req, rows[0], true);
        const result = await database.query(QUERY.UPDATE_IMAGE, [imagePath, iduser]);
        if (!result[0].affectedRows) return res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'User not found' } });
        res.status(200).json({ code: 200, status: 'OK', message: 'Profile image updated successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while updating profile image', log: error.message } });
    }
});


module.exports = router;