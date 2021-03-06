const mysql = require ('mysql');
const dotenv = require ('dotenv');
dotenv.config()

const pool = mysql.createPool({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DB,
    connectionLimit: 10,
});

module.exports = pool;