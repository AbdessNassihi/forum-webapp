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
        res.status(200).json({ code: 200, status: 'OK', message: 'Followed successfully' });
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
        res.status(200).json({ code: 200, status: 'OK', message: 'Unfollowed successfully' });
    } catch (error) {

        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while unfollowing user', log: error.message } });
    }
});





module.exports = router;