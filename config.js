const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    dev: {
        connectionLimit: 5,
        host: '127.0.0.1',
        user: 'root',
        password: process.env.PASSWORD,
        database: 'proyect-comerce',
    },
    prod:{
        connectionLimit: 5,
        // host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: 'proyect-comerce',
        socketPath: process.env.SOCKETPATH
    }
}