const database = require('../../db/dbconnection');
const QUERY = require('../../db/query')
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
const upload = multer({ storage: storage });

const getImagePath = (req, user) => {
    if (req.file) {
        return req.file.path;
    }
    if (user) { return user.img_url }
    return path.join('/uploads', 'default_image.jpg');
}

const validateUser = [
    check('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    check('email').isEmail().withMessage('Invalid email format'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const validateCredentials = async (username, email) => {

    try {
        const [row_username] = await database.query(QUERY.FIND_ONE, username);
        const [row_email] = await database.query(QUERY.FIND_ONE_MAIL, email)
        if (row_username[0] && row_email[0]) { return "Username and email already used"; }
        else if (row_username[0]) { return "Username already used"; }
        else if (row_email[0]) { return "Email already used"; }
        else return null;

    } catch (error) {
        return "Vaidation failed";
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
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'No images found' } });
        } else {

            const desFields = ['iduser', 'img_url'];
            const imagePaths = rows.map(entry =>
                desFields.reduce((acc, field) => ({ ...acc, [field]: entry[field] }), {})
            );
            const archive = archiver('zip', { zlib: { level: 9 } });
            archive.pipe(res);
            imagePaths.forEach((image, index) => {
                const imageFileName = `${image.iduser}.jpg`;
                archive.file(image.img_url, { name: imageFileName });
            });
            archive.finalize();
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error retrieving images', log: error } });

    }

});

router.get('/images/:id', async (req, res) => {

    try {
        const iduser = parseInt(req.params.id);
        const [rows] = await database.query(QUERY.SELECT_USER, iduser);
        if (!rows[0]) {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'Image not found' } });
        } else {
            console.log(path.join('/usr/code/src', rows[0].img_url));
            res.sendFile(path.join('/usr/code', rows[0].img_url));
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error retrieving image', log: error } });
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

router.post('/', upload.single('profileImage'), validateUser, async (req, res) => {


    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(400).json({ code: 400, status: 'Bad Request', errors: errors.array() }); }

    try {
        const { username, email, password, is_admin, textuser } = req.body;
        const validationError = await validateCredentials(username, email);
        if (validationError) { return res.status(400).json({ code: 400, status: 'Bad Request', message: validationError }); }
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
        console.error('Error creating user:', error);
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error creating user', log: error } });
    }
});

router.put('/:id', upload.single('profileImage'), validateUser, async (req, res) => {
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
            const validationError = await validateCredentials(username, email);
            if (rows[0].username == username && rows[0].email != email) {
                if (validationError == "Email already used" || validationError == "Username and email already used") { return res.status(400).json({ code: 400, status: 'Bad Request', message: "Email already used" }); }
            } else if (rows[0].email == email && rows[0].username != username) {
                if (validationError == "Username already used" || validationError == "Username and email already used") { return res.status(400).json({ code: 400, status: 'Bad Request', message: "Username already used" }); }
            } else if (rows[0].username != username && rows[0].email != email) {
                if (validationError) { return res.status(400).json({ code: 400, status: 'Bad Request', message: validationError }); }
            }
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