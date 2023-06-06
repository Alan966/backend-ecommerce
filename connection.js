const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const { dev, prod } = require('./config');

let config = prod;
const pool = mysql.createPool(config);
const MySQL = {
    getPool : async () => {
        return pool;
    }
}

module.exports = MySQL;