const database = require('../../db/dbconnection');
const QUERY = require('../../db/query');
const express = require('express');
const router = express.Router();


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
})