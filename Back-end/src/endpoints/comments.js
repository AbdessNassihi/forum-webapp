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


/* DELETING A COMMENT */
router.delete('/:idcomment', async (req, res) => {
    try {
        const idcomment = parseInt(req.params.idcomment);
        const result = await database.query(QUERY.DELETE_COMMENT, idcomment);
        if (!result.affectedRows) return res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Comment not found' } });
        res.status(200).json({ code: 200, status: 'OK', message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while deleting comment', log: error.message } });
    }
});

/* RETRIEVING THE SUBCOMMENTS */

// retrieving the subcomments of a comment
router.get('sub-comments/:idcomment/', async (req, res) => {
    try {
        const idcomment = parseInt(req.params.idcomment);
        const [rows] = await database.query(QUERY.SELECT_SUBCOMMENTS, [idcomment]);
        if (rows.length > 0) {
            res.status(200).json({ code: 200, status: 'OK', message: 'Sub comments retrieved successfully', data: rows });
        } else {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Sub comments not found' } });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while retrieving sub comment', log: error.message } });
    }
});

// retrieving a subcomment
router.get('sub-comments/:idsubcomment', async (req, res) => {
    try {
        const idsubcomment = parseInt(req.params.idsubcomment);
        const [rows] = await database.query(QUERY.SELECT_SUBCOMMENT, [idsubcomment]);
        if (rows.length > 0) {
            res.status(200).json({ code: 200, status: 'OK', message: 'Sub comment retrieved successfully', data: rows[0] });
        } else {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Sub comment not found' } });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while retrieving sub comment', log: error.message } });
    }
});

module.exports = router;

