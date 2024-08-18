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
            res.status(200).json({ code: 200, status: 'OK', message: 'Post retrieved successfully', post: rows[0] });
        } else {
            res.status(404).json({ code: 404, status: 'Not Found', message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while retrieving post', log: error.message } });
    }
});

router.get('/', async (req, res) => {
    try {
        const iduser = req.user.iduser;
        const [posts_subscriptions] = await database.query(QUERY.SELECT_POSTS_FOR_USER, [iduser]);
        const [posts_followings] = await database.query(QUERY.SELECT_POSTS_OF_FOLLOWINGS, [iduser]);
        const [posts_user_thread] = await database.query(QUERY.SELECT_POSTS_OF_USER_THREADS, [iduser]);
        const allPosts = [...posts_subscriptions, ...posts_followings, ...posts_user_thread];

        const posts = allPosts.filter((post, index, self) =>
            index === self.findIndex((p) => p.idpost === post.idpost)
        );
        if (posts.length > 0) {
            res.status(200).json({ code: 200, status: 'OK', message: 'Posts retrieved successfully', posts: posts });
        } else {
            res.status(404).json({ code: 404, status: 'Not Found', message: 'Posts not found', posts: [] });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while retrieving posts', log: error.message } });
    }
});


/* UPDATING AND DELETING POSTS */

// Updating the content of the post
router.put('/content/:idpost', async (req, res) => {

    try {
        const idpost = parseInt(req.params.idpost);
        const { content } = req.body;
        const result = await database.query(QUERY.UPDATE_POST, [content, idpost]);
        if (!result[0].affectedRows) return res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Post not found' } });
        res.status(200).json({ code: 200, status: 'OK', message: 'Post updated successfully' });
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while updating post', log: error.message } });
    }
});

// Liking a post
router.post('/:idpost/like', async (req, res) => {

    try {
        const idpost = parseInt(req.params.idpost);
        const iduser = req.user.iduser;
        const result = await database.query(QUERY.ADD_LIKE_POST, [idpost, iduser]);
        if (!result[0].affectedRows) throw new Error('Liking of the post failed');
        res.status(200).json({ code: 200, status: 'OK', message: 'Post liked successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ code: 400, status: 'Bad Request', error: 'post already liked' });
        } else {
            res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while liking the post', log: error.message } });
        }
    }
});

// To (un)pin a post
router.put('/:idpost/pinned/:pin', async (req, res) => {
    try {
        const idpost = parseInt(req.params.idpost);
        const toPin = parseInt(req.params.pin);
        console.log(toPin);
        const result = await database.query(QUERY.UPDATE_PINNED, [toPin, idpost]);
        if (!result[0].affectedRows) return res.status(404).json({ code: 404, status: 'Not Found', message: 'Post not found' });
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
        if (!result[0].affectedRows) return res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Post not found' } });
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
            res.status(200).json({ code: 200, status: 'OK', message: 'comments of post retrieved successfully', comments: rows });
        } else {
            res.status(404).json({ code: 404, status: 'Not Found', message: 'No comments found', comments: [] });
        }
    } catch (error) {
        console.log(error);
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
        if (!result[0].affectedRows) throw new Error('Comment creation failed');
        res.status(201).json({ code: 201, status: 'Created', message: 'Comment created successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while creating comment', log: error.message } });
    }
});


module.exports = router;