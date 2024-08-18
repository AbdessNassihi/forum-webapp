const express = require('express');
const router = express.Router();

const database = require('../../db/dbconnection');
const { THREAD_QUERY: QUERY } = require('../../db/query');


const { validationResult } = require('express-validator');
const { validateThreadTitle } = require('../input_validation');
const { handleImageUpload, getImagePath } = require('../imagesUtils');
const path = require('path');



/* RETIRIEVING THREADS */

// selecting all the threads
router.get('/', async (req, res) => {
    try {
        const [rows] = await database.query(QUERY.SELECT_THREADS);
        if (rows.length > 0) {
            res.status(200).json({ code: 200, status: 'OK', message: 'Threads retrieved successfully', threads: rows });
        } else {
            res.status(404).json({ code: 404, status: 'Not Found', message: 'No threads found', threads: [] });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while retrieving threads', log: error.message } });
    }
})




// selecting all the threads of a user
router.get('users/:iduser', async (req, res) => {

    try {
        const iduser = parseInt(req.params.iduser);
        const [rows] = await database.query(QUERY.SELECT_THREADS_OF_USER, [iduser]);
        if (rows.length > 0) {
            res.status(200).json({ code: 200, status: 'OK', message: 'Threads of user retrieved successfully', data: rows[0] });
        } else {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Threads of user not found' } });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while retrieving threads of user', log: error.message } });
    }

});


// selecting a thread
router.get('/:idthread', async (req, res) => {

    try {
        const idthread = parseInt(req.params.idthread);
        const [rows] = await database.query(QUERY.SELECT_THREAD, [idthread]);
        if (rows.length > 0) {
            res.status(200).json({ code: 200, status: 'OK', message: 'Thread retrieved successfully', data: rows[0] });
        } else {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Thread not found' } });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while retrieving thread', log: error.message } });
    }

});


// selecting image of a thread
router.get('/images/:idthread', async (req, res) => {
    try {
        const idthread = parseInt(req.params.idthread);
        const [rows] = await database.query(QUERY.SELECT_THREAD, [idthread]);
        if (rows.length > 0) {
            res.sendFile(path.join('/usr/code', rows[0].img_url));
        } else {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Image of thread not found' } });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while retrieving image of thread', log: error.message } });
    }

});


/* Creating threads */
router.post('/', validateThreadTitle, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(400).json({ code: 400, status: 'Bad Request', errors: errors.array() }); }

    try {
        const iduser = req.user.iduser;
        const { title, textthread } = req.body;
        const result = await database.query(QUERY.NEW_THREAD, [iduser, title, textthread]);

        if (!result[0].affectedRows) throw new Error('Thread creation failed');
        res.status(201).json({ code: 201, status: 'Created', message: 'Thread created successfully', data: result });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            let errors = [];
            errors.push({ path: 'title', msg: 'title already used' });
            return res.status(400).json({ code: 400, status: 'Bad Request', errors: errors });
        } else {
            return res.status(500).json({ code: 500, status: 'Internal Server Error', message: 'Error creating thread', log: error.message });
        }
    }
});



/* UPDATING AND DELETING THREADS */

// Updating the title
router.put('/title/:idthread', validateThreadTitle, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(400).json({ code: 400, status: 'Bad Request', errors: errors.array() }); }
    try {
        const idthread = parseInt(req.params.idthread);
        const { title } = req.body;
        const result = await database.query(QUERY.UPDATE_TITLE, [title, idthread]);

        if (!result[0].affectedRows) return res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Thread not found' } });
        res.status(200).json({ code: 200, status: 'OK', message: 'Thread title updated successfully' });

    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while updating thread title', log: error.message } });
    }
});



// Deleting a thread
router.delete('/:idthread', async (req, res) => {
    try {
        console.log('test');
        const idthread = parseInt(req.params.idthread);
        const result = await database.query(QUERY.DELETE_THREAD, [idthread]);
        if (!result[0].affectedRows) return res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Thread not found' } });
        res.status(200).json({ code: 200, status: 'OK', message: 'Thread deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while deleting thread', log: error.message } });
    }
});


/* RETRIEVING POSTS */
router.get('/:idthread/posts', async (req, res) => {
    try {
        const idthread = parseInt(req.params.idthread);
        const [rows] = await database.query(QUERY.SELECT_POSTS, [idthread]);
        if (rows.length > 0) {
            res.status(200).json({ code: 200, status: 'OK', message: 'Posts of thread retrieved successfully', posts: rows });
        } else {
            res.status(404).json({ code: 404, status: 'Not Found', message: 'No posts found', posts: [] });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error retrieving posts of thread', log: error.message } });
    }

});

/* CREATING POSTS */
router.post('/:idthread/posts', async (req, res) => {
    try {
        const idthread = parseInt(req.params.idthread);
        const iduser = req.user.iduser;
        const { content, title } = req.body;
        const result = await database.query(QUERY.NEW_POST, [idthread, iduser, content, title]);
        if (!result[0].affectedRows) throw new Error('Post creation failed');
        res.status(201).json({ code: 201, status: 'Created', message: 'Post created successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while creating post', log: error.message } });

    }
});


module.exports = router;