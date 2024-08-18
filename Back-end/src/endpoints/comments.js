const express = require('express');
const router = express.Router();

const database = require('../../db/dbconnection');
const { COMMENT_QUERY: QUERY } = require('../../db/query');


/* RETRIEVING A COMMENT */
router.get('/:idcomment', async (req, res) => {
    try {
        const idcomment = parseInt(req.params.idcomment);
        const [rows] = await database.query(QUERY.SELECT_COMMENT, [idcomment]);
        if (rows.length > 0) {
            res.status(200).json({ code: 200, status: 'OK', message: 'Comment retrieved successfully', data: rows[0] });
        } else {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Comment not found' } });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while retrieving comment', log: error.message } });
    }

});

// Liking a comment
router.post('/:idcom/like', async (req, res) => {

    try {
        console.log('test');
        const idcom = parseInt(req.params.idcom);
        const iduser = req.user.iduser;
        const result = await database.query(QUERY.ADD_LIKE_COMMENT, [idcom, iduser]);
        if (!result[0].affectedRows) throw new Error('Liking of the comment failed');
        res.status(200).json({ code: 200, status: 'OK', message: 'Comment liked successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ code: 400, status: 'Bad Request', error: 'Comment already liked' });
        } else {
            res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while liking the comment', log: error.message } });
        }
    }
});




/* DELETING A COMMENT */
router.delete('/:idcomment', async (req, res) => {
    try {
        const idcomment = parseInt(req.params.idcomment);
        const result = await database.query(QUERY.DELETE_COMMENT, idcomment);
        if (!result[0].affectedRows) return res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Comment not found' } });
        res.status(200).json({ code: 200, status: 'OK', message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while deleting comment', log: error.message } });
    }
});



module.exports = router;

