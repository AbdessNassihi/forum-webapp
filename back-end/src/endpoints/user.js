const express = require('express');
const router = express.Router();

const database = require('../../db/dbconnection');
const { USER_QUERY: QUERY, POST_QUERY, THREAD_QUERY } = require('../../db/query');

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


router.get('/:iduser', async (req, res) => {
    try {
        const iduser = parseInt(req.params.iduser);
        const [userRows] = await database.query(QUERY.SELECT_USER, [iduser]);
        const user = userRows[0];

        const [posts] = await database.query(POST_QUERY.SELECT_POSTS_OF_USER, [iduser]);


        const [createdThreads] = await database.query(THREAD_QUERY.SELECT_THREADS_OF_USER, [iduser]);

        const [followedThreads] = await database.query(THREAD_QUERY.SELECT_FOLLOWED_THREADS, [iduser]);

        const [[{ count: numFollowers }]] = await database.query(QUERY.COUNT_FOLLOWERS, [iduser]);
        const [[{ count: numFollowings }]] = await database.query(QUERY.COUNT_FOLLOWINGS, [iduser]);


        if (user) {

            const responseData = {
                id: user.iduser,
                isAdmin: user.is_admin,
                username: user.username,
                email: user.email,
                textuser: user.textuser,
                posts: posts,
                createdThreads: createdThreads,
                followedThreads: followedThreads,
                numFollowers: numFollowers,
                numFollowings: numFollowings,
            };


            res.status(200).json({ code: 200, status: 'OK', message: 'User retrieved successfully', user: responseData });
        } else {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'User not found' } });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while retrieving user', log: error.message } });
    }
});

router.get('/username/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const iduser = req.user.iduser;
        const [rows] = await database.query(QUERY.FIND_USER, [iduser, username]);
        if (rows.length > 0) {
            res.status(200).json({ code: 200, status: 'OK', message: 'User retrieved successfully', user: rows[0] });
        } else {
            res.status(404).json({ code: 404, status: 'Not Found', message: 'User not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while retrieving user', log: error.message } });
    }

});



// Retrieving profile image of an user
router.get('/:iduser/image/', async (req, res) => {
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
        if (!result[0].affectedRows) return res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'User not found' } });
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
    try {
        const iduser = req.user.iduser;

        const { username } = req.body;
        const result = await database.query(QUERY.UPDATE_USERNAME, [username, iduser]);
        if (!result[0].affectedRows) return res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'User not found' } });
        res.status(200).json({ code: 200, status: 'OK', message: 'Username updated successfully', field: 'username', data: result });
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
        res.status(200).json({ code: 200, status: 'OK', message: 'Text user updated successfully', field: 'textuser', data: result });
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
        res.status(200).json({ code: 200, status: 'OK', message: 'Password updated successfully', field: 'password', data: result });
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
        res.status(200).json({ code: 200, status: 'OK', message: 'Profile image updated successfully', field: 'image', data: result });
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while updating profile image', log: error.message } });
    }
});

router.put('/:iduser/admin', async (req, res) => {
    try {
        const iduser = parseInt(req.params.iduser);
        const result = await database.query(QUERY.UPDATE_STATUS, [iduser]);
        if (!result[0].affectedRows) return res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'User not found' } });
        res.status(200).json({ code: 200, status: 'OK', message: 'Status updated successfully', field: 'image', data: result });
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while updating status of user', log: error.message } });
    }
});


module.exports = router;