const express = require('express');
const passport = require('../auth_strategy');
const router = express.Router();


router.post('/', passport.authenticate('local', { failureRedirect: '/login/failure' }), (req, res) => {

    res.status(200).json({ code: 200, status: 'OK', message: 'Authentication succeed' });
});

router.get('/failure', (req, res) => {
    res.status(401).json({ code: 401, status: 'Unauthorized', message: 'Authentication failed' });
})

module.exports = router;
