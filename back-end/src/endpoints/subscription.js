const express = require('express');
const router = express.Router();

const database = require('../../db/dbconnection');
const { THREAD_QUERY: QUERY } = require('../../db/query');


/* SUSCRIBING TO A THREAD */
router.post('/:idthread', async (req, res) => {
    try {
        const idthread = parseInt(req.params.idthread);
        const iduser = req.user.iduser;
        const result = await database.query(QUERY.SUBSCRIBE_TO_THREAD, [iduser, idthread]);
        if (!result[0].affectedRows) throw new Error('Subscription failed');
        res.status(201).json({ code: 201, status: 'Created', message: 'Subscribed successfully' });
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while subscribing to thread', log: error.message } });
    }
});

/* UNSUSCRIBING TO A THREAD */
router.delete('/:idthread', async (req, res) => {
    try {

        const idthread = parseInt(req.params.idthread);
        const iduser = req.user.iduser;
        const result = await database.query(QUERY.UNSUBSCRIBE_TO_THREAD, [iduser, idthread]);
        if (!result[0].affectedRows) throw new Error('Unsubscription failed');
        res.status(200).json({ code: 200, status: 'OK', message: 'Unsubscribed successfully' });
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error while unsubscribing to thread', log: error.message } });
    }
});


module.exports = router;