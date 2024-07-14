const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const database = require('../db/dbconnection');


const options = {
    schema: {
        tableName: 'user_sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};

const sessionStore = new MySQLStore(options, database);
module.exports = sessionStore;