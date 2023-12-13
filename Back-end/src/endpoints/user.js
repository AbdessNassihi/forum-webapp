const database = require('../../db/dbconnection');
const { USER_QUERY: QUERY } = require('../../db/query');
const bcrypt = require('bcrypt');
const express = require('express');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const archiver = require('archiver');
const path = require('path');
const router = express.Router();
const saltRounds = 10;


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
    return path.join('/uploads', 'default_image.jpg');
}

const validateUser = [
    (req, res, next) => {
        upload.single('profileImage')(req, res, async (err) => {
            if (err) { return res.status(400).json({ code: 400, status: 'Bad Request', message: err.message }); }
            next();
        });
    },
    check('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    check('email').isEmail().withMessage('Invalid email format'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const validateCredentials = async (req, res, next) => {
    const errUsername = "Username already used";
    const errEmail = "Email already used";
    const err = "Username and email already used";
    try {
        const { username, email, update } = req.body;
        const [row_username] = await database.query(QUERY.FIND_ONE, username);
        const [row_email] = await database.query(QUERY.FIND_ONE_MAIL, email)
        if (!update) {
            if (row_username[0] && row_email[0]) { return res.status(400).json({ error: { code: 400, status: 'Bad Request', message: err } }); }
            else if (row_username[0]) { return res.status(400).json({ error: { code: 400, status: 'Bad Request', message: errUsername } }); }
            else if (row_email[0]) { return res.status(400).json({ error: { code: 400, status: 'Bad Request', message: errEmail } }); }
            next();
        } else {
            const iduser = parseInt(req.params.id);
            const [rows] = await database.query(QUERY.SELECT_USER, iduser);
            if (!rows[0]) {
                return res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'User not found' } });
            }
            if (rows[0].username == username && rows[0].email != email) { return res.status(400).json({ error: { code: 400, status: 'Bad Request', message: errEmail } }); }
            else if (rows[0].username != username && rows[0].email == email) { return res.status(400).json({ error: { code: 400, status: 'Bad Request', message: errUsername } }); }
            else if (rows[0].username != username && rows[0].email != email) { return res.status(400).json({ error: { code: 400, status: 'Bad Request', message: err } }); }
            next();
        }
    } catch (error) {
        return res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'validation failedd' } });
    }
};

router.get('/', async (req, res) => {

    try {
        const [rows] = await database.query(QUERY.SELECT_USERS);
        if (!rows || rows.length == 0) {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'No users found' } });
        } else {
            res.status(200).json({ code: 200, status: 'OK', message: 'Users retrieved successfully', data: rows });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error retrieving users', log: error } });
    }
});

router.get('/images', async (req, res) => {

    try {
        const [rows] = await database.query(QUERY.SELECT_USERS);
        if (!rows || rows.length == 0) {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'No images of users found' } });
        } else {

            const desFields = ['iduser', 'img_url'];
            const imagePaths = rows.map(entry =>
                desFields.reduce((acc, field) => ({ ...acc, [field]: entry[field] }), {})
            );
            const archive = archiver('zip', { zlib: { level: 9 } });
            res.attachment('images.zip');
            archive.pipe(res);
            imagePaths.forEach((image, index) => {
                const imageFileName = `${image.iduser}.jpg`;
                archive.file(path.join('/usr/code', image.img_url), { name: imageFileName });
            });
            archive.finalize();
        }

    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error retrieving images of users', log: error } });

    }
});

router.get('/images/:id', async (req, res) => {

    try {
        const iduser = parseInt(req.params.id);
        const [rows] = await database.query(QUERY.SELECT_USER, iduser);
        if (!rows[0]) {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Image not found' } });
        } else {
            res.sendFile(path.join('/usr/code', rows[0].img_url));
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error retrieving image of user', log: error } });
    }

});



router.get('/:id', async (req, res) => {

    try {
        const iduser = parseInt(req.params.id);
        const [rows] = await database.query(QUERY.SELECT_USER, iduser);
        if (!rows[0]) {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'User not found' } });
        } else {
            res.status(200).json({ code: 200, status: 'OK', message: 'User retrieved successfully', data: rows[0] });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error retrieving user', log: error } });
    }

});

router.post('/', validateUser, validateCredentials, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(400).json({ code: 400, status: 'Bad Request', errors: errors.array() }); }

    try {

        const { username, email, password, is_admin, textuser } = req.body;
        const imagePath = getImagePath(req, null);
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const result = await database.query(QUERY.NEW_USER, [username, email, hashedPassword, is_admin, imagePath, textuser, salt]);
        if (result) {
            res.status(201).json({ code: 201, status: 'Created', message: 'User created successfully', data: result });
        } else {
            res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error creating user' } });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error creating user', log: error } });
    }
});
router.post('/follow/:id', async (req, res) => {

    const iduser = req.body.iduser;
    const [rows] = await database.query(QUERY.SELECT_USER, iduser);
    if (!rows[0]) {
        res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'User not found' } });
    }
    try {
        const follower_id = parseInt(req.params.id);
        const result = await database.query(QUERY.NEW_FOLLOW, [follower_id, iduser])
        if (result) {
            res.status(201).json({ code: 201, status: 'Created', message: 'User is following the requested user', data: result });
        }
        else {
            res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error following the user' } });
        }

    } catch {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error following the user', log: error } });
    }
});

router.put('/:id', validateUser, validateCredentials, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(400).json({ code: 400, status: 'Bad Request', errors: errors.array() }); }

    try {
        const iduser = parseInt(req.params.id);
        const [rows] = await database.query(QUERY.SELECT_USER, iduser);
        if (!rows[0]) {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'User not found' } });
        } else {
            const imagePath = getImagePath(req, rows[0]);
            const { username, email, password, textuser } = req.body;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);
            const result = await database.query(QUERY.UPDATE_USER, [username, email, hashedPassword, imagePath, textuser, salt, iduser]);
            if (result) {
                res.status(200).json({ code: 200, status: 'OK', message: 'User updated successfully' });
            } else {
                res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error updating user' } });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error updating user', log: error } });
    }
});

router.delete('/:id', async (req, res) => {

    try {
        const iduser = parseInt(req.params.id);
        const [rows] = await database.query(QUERY.SELECT_USER, iduser);
        if (!rows[0]) {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'User not found' } });
        } else {
            const result = await database.query(QUERY.DELETE_USER, [iduser]);
            if (result) {
                res.status(200).json({ code: 200, status: 'OK', message: 'User deleted successfully' });
            } else {
                res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error deleting user' } });
            }
        }
    } catch {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error deleting user', log: error } });
    }
});



module.exports = router;