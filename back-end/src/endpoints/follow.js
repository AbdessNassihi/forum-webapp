const express = require('express');
const router = express.Router();

const database = require('../../db/dbconnection');
const { USER_QUERY: QUERY } = require('../../db/query');


/* (UN)FOLLOWING USERS */
router.post('/:iduser', async (req, res) => {
    try {
        const idfollowing = parseInt(req.params.iduser);
        const idfollower = req.user.iduser;
        const result = await database.query(QUERY.FOLLOW_USER, [idfollower, idfollowing]);
        if (!result[0].affectedRows) throw new Error('Following user failed');
        res.status(200).json({ code: 200, status: 'OK', message: 'Followed successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while following user', log: error.message } });
    }
});

router.delete('/:iduser', async (req, res) => {
    try {

        const idfollowing = parseInt(req.params.iduser);
        const idfollower = req.user.iduser;
        const result = await database.query(QUERY.UNFOLLOW_USER, [idfollower, idfollowing]);
        if (!result[0].affectedRows) throw new Error('Unfollowing user failed');
        res.status(200).json({ code: 200, status: 'OK', message: 'Unfollowed successfully', data: result });
    } catch (error) {

        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while unfollowing user', log: error.message } });
    }
});


/* RETRIEVING THE FOLLOWERS OF THE USER*/
router.get('/followers/:iduser', async (req, res) => {
    try {
        const iduser = parseInt(req.params.iduser);
        const [rows] = database.query(QUERY.SELECT_FOLLOWERS, iduser);
        if (rows.length > 0) {
            res.status(200).json({ code: 200, status: 'OK', message: 'Followers retrieved successfully', data: rows });
        } else {
            res.status(404).json({ code: 404, status: 'Not Found', message: 'Followers not found' });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while retrieving followers', log: error.message } });
    }
});


/* RETRIEVING THE USERS A USER IS FOLLOWING*/
router.get('/following/:iduser', async (req, res) => {
    try {
        const iduser = parseInt(req.params.iduser);
        const [rows] = database.query(QUERY.SELECT_FOLLOWING, iduser);
        if (rows.length > 0) {
            res.status(200).json({ code: 200, status: 'OK', message: 'Followings retrieved successfully', data: rows });
        } else {
            res.status(404).json({ code: 404, status: 'Not Found', message: 'Followins not found' });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while retrieving followings', log: error.message } });

    }

});


module.exports = router;