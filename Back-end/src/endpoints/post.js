const express = require('express');
const router = express.Router();

const database = require('../../db/dbconnection');
const { POST_QUERY: QUERY } = require('../../db/query');


/* RETRIEVE A POST */
router.get('/:idpost', async (req, res) => {
    try {
        const idpost = parseInt(req.params.idpost);
        const [rows] = await database.query(QUERY.SELECT_POST, [idpost]);
        if (rows.length > 0) {
            res.status(200).json({ code: 200, status: 'OK', message: 'Post retrieved successfully', data: rows[0] });
        } else {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Post not found' } });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while retrieving post', log: error.message } });
    }
});


/* UPDATING AND DELETING POSTS */

// Updating the content of the post
router.put('/:idpost', async (req, res) => {
    try {
        const idpost = parseInt(req.params.idpost);
        const { content } = req.body;
        const result = await database.query(QUERY.UPDATE_POST, [content, idpost]);
        if (!result.affectedRows) return res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Post not found' } });
        res.status(200).json({ code: 200, status: 'OK', message: 'Post updated successfully' });
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while updating post', log: error.message } });
    }
});

// Incrementing the score of the post
router.put('/:idpost/score', async (req, res) => {
    try {
        const idpost = parseInt(req.params.idpost);
        const [rows] = await database.query(QUERY.SELECT_POST, [idpost]);
        if (!rows[0]) {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Post not found' } });
        } else {
            const newSore = rows[0].score + 1;
            const result = await database.query(QUERY.UPDATE_SCORE, [newSore, idpost]);
            if (!result.affectedRows) throw new Error('Updating score of post failed');
            res.status(200).json({ code: 200, status: 'OK', message: 'Score of post updated successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while updating score of post', log: error.message } });
    }
});

// To (un)pin a post
router.put('/:idpost/pinned/:pin', async (req, res) => {
    try {
        const idpost = parseInt(req.params.idpost);
        const toPin = req.params.pin === 'true';
        const result = await database.query(QUERY.UPDATE_PINNED, [toPin ? 1 : 0, idpost]);
        if (!result.affectedRows) return res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Post not found' } });
        res.status(200).json({ code: 200, status: 'OK', message: 'Post (un)pinned successfully' });
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while (un)pinning post', log: error.message } });
    }
});

// Deleting a post
router.delete('/:idpost', async (req, res) => {
    try {
        const idpost = parseInt(req.params.idpost);
        const result = await database.query(QUERY.DELETE_POST, idpost);
        if (!result.affectedRows) return res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Post not found' } });
        res.status(200).json({ code: 200, status: 'OK', message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while deleting post', log: error.message } });
    }
});


/* RETRIEVING COMMENTS */
router.get('/:idpost/comments', async (req, res) => {
    try {
        const idpost = parseInt(req.params.idpost);
        const [rows] = await database.query(QUERY.SELECT_COMMENTS, [idpost]);
        if (rows.length > 0) {
            res.status(200).json({ code: 200, status: 'OK', message: 'comments of post retrieved successfully', data: rows });
        } else {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'No comments found' } });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while retrieving comments of post', log: error.message } });
    }
});

/* CREATING COMMENTS */
router.post('/:idpost/comments', async (req, res) => {
    try {
        const idpost = parseInt(req.params.idpost);
        const iduser = req.user.iduser;
        const { content } = req.body;
        const result = await database.query(QUERY.NEW_COMMENT, [idpost, iduser, content]);
        if (!result.affectedRows) throw new Error('Comment creation failed');
        res.status(201).json({ code: 201, status: 'Created', message: 'Comment created successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while creating comment', log: error.message } });
    }
});


module.exports = router;