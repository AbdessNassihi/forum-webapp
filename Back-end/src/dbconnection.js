const mysql = require('mysql2');
dotenv.config({ path: '../.env' });
const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    connectionLimit: process.env.DATABASE_CONNECTION_LIMIT
});

const promisePool = pool.promise();

module.exports = promisePool;
