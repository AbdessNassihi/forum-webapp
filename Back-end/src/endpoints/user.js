const database = require('../../db/dbconnection');
const QUERY = require('../../db/query')
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const saltRounds = 10;

router.get('/', async (req, res) => {

    try {
        const [rows] = await database.query(QUERY.SELECT_USERS);
        if (!rows || rows.length == 0) {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'No users found' } });
        } else {
            res.status(200).json({ code: 200, status: 'OK', message: 'Users retrieved successfully', data: rows });
        }
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error retrieving users', error: error } });
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
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error retrieving user' } });
    }

});

router.post('/', async (req, res) => {

    try {
        const { username, email, password, is_admin, img_url, textuser } = req.body;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const result = await database.query(QUERY.NEW_USER, [username, email, hashedPassword, is_admin, img_url, textuser, salt]);
        if (result) {
            res.status(201).json({ code: 201, status: 'Created', message: 'User created successfully', data: { id: result.insertId } });
        } else {
            res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error creating user' } });
        }
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error creating user', log: error } });
    }
});

router.put('/:id', async (req, res) => {

    try {
        const iduser = parseInt(req.params.id);
        const [rows] = await database.query(QUERY.SELECT_USER, iduser);
        if (!rows[0]) {
            res.status(404).json({ error: { code: 404, status: 'Not Found', message: 'User not found' } });
        } else {

            const { username, email, password, img_url, textuser } = req.body;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);
            const result = await database.query(QUERY.UPDATE_USER, [username, email, hashedPassword, img_url, textuser, salt]);
            if (result && result.affectedRows == 1) {
                res.status(200).json({ code: 200, status: 'OK', message: 'User updated successfully' });
            } else {
                res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error updating user' } });
            }
        }
    } catch (error) {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error updating user' } });
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
            if (result && result.affectedRows == 1) {
                res.status(200).json({ code: 200, status: 'OK', message: 'User deleted successfully' });
            } else {
                res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error deleting user' } });
            }
        }
    } catch {
        res.status(500).json({ error: { code: 500, status: 'Internal Server Error', message: 'Error deleting user' } });
    }
});

module.exports = router;