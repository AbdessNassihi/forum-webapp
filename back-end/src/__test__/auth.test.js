const request = require('supertest');
const express = require('express');
const router = require('../endpoints/auth');
const bcrypt = require('bcrypt');
const database = require('../../db/dbconnection');
const { getImagePath } = require('../imagesUtils');

jest.mock('bcrypt');
jest.mock('../../db/dbconnection');
jest.mock('../imagesUtils');

const app = express();
app.use(express.json());
app.use(router);

describe('POST /register', () => {
    it('should register a new user successfully', async () => {
        const mockUserData = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'Passwordofuser?13',
            is_admin: false,
            textuser: 'Some text'
        };

        bcrypt.genSaltSync.mockReturnValue('mockSalt');
        bcrypt.hashSync.mockReturnValue('hashedPassword');
        database.query.mockResolvedValue([{ affectedRows: 1 }]);
        getImagePath.mockReturnValue('mockImagePath');

        const response = await request(app)
            .post('/register')
            .send(mockUserData);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            code: 201,
            status: 'Created',
            message: 'User registered successfully',
            data: [{ affectedRows: 1 }]
        });
    });

    it('should return 400 for duplicate username or email', async () => {
        const mockUserData = {
            username: 'testuser',
            email: 'duplicate@example.com',
            password: 'Passwordofuser?13',
            is_admin: false,
            textuser: 'Some text'
        };

        const duplicateError = new Error('Duplicate entry');
        duplicateError.code = 'ER_DUP_ENTRY';
        duplicateError.sqlMessage = 'Duplicate entry for email';

        database.query.mockRejectedValue(duplicateError);
        getImagePath.mockReturnValue('mockImagePath');

        const response = await request(app)
            .post('/register')
            .send(mockUserData);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            code: 400,
            status: 'Bad Request',
            errors: [{ path: 'email', msg: 'email already used' }]
        });
    });

    it('should return 500 for other errors', async () => {
        const mockUserData = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'Passwordofuser?13',
            is_admin: false,
            textuser: 'Some text'
        };

        database.query.mockRejectedValue(new Error('Some internal error'));
        getImagePath.mockReturnValue('mockImagePath');

        const response = await request(app)
            .post('/register')
            .send(mockUserData);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            code: 500,
            status: 'Internal Server Error',
            message: 'Error while registering user',
            log: 'Some internal error'
        });
    });
});
