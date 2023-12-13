const database = require('../../db/dbconnection');
const { THREAD_QUERY: QUERY, USER_QUERY: QUERYUSER } = require('../../db/query');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const archiver = require('archiver');
const path = require('path');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Invalid file type'), false);
    }
    cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter });



const getImagePath = (req, user) => {
    if (req.file) {
        return req.file.path;
    }
    if (user) { return user.img_url }
    return path.join('/uploads', 'default_image_thread.jpg');
}

const validateThread = [
    (req, res, next) => {
        upload.single('threadImage')(req, res, async (err) => {
            if (err) { return res.status(400).json({ code: 400, status: 'Bad Request', message: err.message }); }
            next();
        });
    },
    check('title').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
];

const validateCredentials = async (req, res, next) => {
    const errTitle = "Thread title already created";
    try {
        const { title, update } = req.body;
        const [row_title] = await database.query(QUERY.FIND_ONE, title);
        if (!update) {
            if (row_title[0]) { return res.status(400).json({ error: { code: 400, status: 'Bad Request', message: errTitle } }); }
            next();
        } else {

            const idthread = parseInt(req.params.id);
            const [rows] = await database.query(QUERY.SELECT_THREAD, idthread);
            if (!rows[0]) {
                return res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Thread not found' } });
            }
            if (rows[0].title != title && row_title[0]) { return res.status(400).json({ error: { code: 400, status: 'Bad Request', message: errTitle } }); }
            next();
        }
    } catch (error) {
        return res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'validation failed' } });
    }
};


router.get('/', async (req, res) => {
    try {
        const [rows] = await database.query(QUERY.SELECT_THREADS);
        if (!rows || rows.length == 0) {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'No threads found' } });
        } else {
            res.status(200).json({ code: 200, status: 'OK', message: 'Threads retrieved successfully', data: rows });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error retrieving users', log: error } });
    }
})

router.get('/:id', async (req, res) => {

    try {
        const iduser = parseInt(req.params.id);
        const [rows] = await database.query(QUERY.SELECT_THREADS_OF_USER, iduser);
        if (!rows[0]) {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Threads of user not found' } });
        } else {
            res.status(200).json({ code: 200, status: 'OK', message: 'Threads of user retrieved successfully', data: rows[0] });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error retrieving threads of user', log: error } });
    }

});

router.get('/following/:id', async (req, res) => {

    try {
        const iduser = parseInt(req.params.id);
        const [rows] = await database.query(QUERY.SELECT_FOLLOWING_THREADS, iduser);
        if (!rows[0]) {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Following threads of user not found' } });
        } else {
            res.status(200).json({ code: 200, status: 'OK', message: 'Following threads of user retrieved successfully', data: rows[0] });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error retrieving following threads of user', log: error } });
    }

});
router.post('/follow/:id', async (req, res) => {

    const iduser = req.body.iduser;
    const [rows] = await database.query(QUERYUSER.SELECT_USER, iduser);
    if (!rows[0]) {
        res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'User not found' } });
    }
    try {
        const idthread = parseInt(req.params.id);
        const result = await database.query(QUERY.NEW_FOLLOW, [iduser, idthread])
        if (result) {
            res.status(201).json({ code: 201, status: 'Created', message: 'User is following the thread', data: result });
        }
        else {
            res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error following the thread' } });
        }

    } catch {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error following the thread', log: error } });
    }
});

router.post('/', validateThread, validateCredentials, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(400).json({ code: 400, status: 'Bad Request', errors: errors.array() }); }

    try {
        const { iduser, title, follow_only } = req.body;
        const imagePath = getImagePath(req, null);
        const result = await database.query(QUERY.NEW_THREAD, [iduser, title, imagePath, follow_only]);
        if (result) {
            res.status(201).json({ code: 201, status: 'Created', message: 'Thread created successfully', data: result });
        } else {
            res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error creating thread' } });
        }

    } catch {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error creating thread', log: error } });
    }
});

router.put('/:id', validateThread, validateCredentials, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(400).json({ code: 400, status: 'Bad Request', errors: errors.array() }); }

    try {
        const idthread = parseInt(req.params.id);
        const [rows] = await database.query(QUERY.SELECT_THREAD, idthread);
        if (!rows[0]) {
            return res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Thread not found' } });
        } else {
            const imagePath = getImagePath(req, rows[0]);
            const { title, follow_only } = req.body;
            const result = await database.query(QUERY.UPDATE_THREAD, [title, imagePath, follow_only, idthread]);
            if (result) {
                res.status(200).json({ code: 200, status: 'OK', message: 'Thread updated successfully' });
            } else {
                res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error updating thread' } });
            }
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error updating thread', log: error } });
    }
});

router.get('/images', async (req, res) => {

    try {
        const [rows] = await database.query(QUERY.SELECT_THREADS);
        if (!rows || rows.length == 0) {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'No images of threads found' } });
        } else {

            const desFields = ['idthread', 'img_url'];
            const imagePaths = rows.map(entry =>
                desFields.reduce((acc, field) => ({ ...acc, [field]: entry[field] }), {})
            );
            const archive = archiver('zip', { zlib: { level: 9 } });
            res.attachment('images.zip');
            archive.pipe(res);
            imagePaths.forEach((image, index) => {
                const imageFileName = `${image.idthread}.jpg`;
                archive.file(path.join('/usr/code', image.img_url), { name: imageFileName });
            });
            archive.finalize();
        }

    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error retrieving images of threads', log: error } });

    }
});

router.get('/images/:id', async (req, res) => {

    try {
        const idthread = parseInt(req.params.id);
        const [rows] = await database.query(QUERY.SELECT_THREAD, idthread);
        if (!rows[0]) {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Image of thread not found' } });
        } else {
            res.sendFile(path.join('/usr/code', rows[0].img_url));
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error retrieving image of thread', log: error } });
    }

});


router.delete('/:id', async (req, res) => {

    try {
        const idthread = parseInt(req.params.id);
        const [rows] = await database.query(QUERY.SELECT_THREAD, idthread);
        if (!rows[0]) {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Thread not found' } });
        } else {
            const result = await database.query(QUERY.DELETE_THREAD, [idthread]);
            if (result) {
                res.status(200).json({ code: 200, status: 'OK', message: 'Thread deleted successfully' });
            } else {
                res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error deleting thread' } });
            }
        }
    } catch {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error deleting thread', log: error } });
    }
});


module.exports = router;