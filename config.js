module.exports = {
    dev:{
     host: 'localhost',
     user: 'root',
     password: '',
     database: 'project_sis'
    },
    prod:{
        connectionLimit: 5,
        host: process.env.HOST,
        user: 'root',
        password: process.env.PASSWORD,
        database: 'proyect-comerce',
       //  socketPath: process.env.SOCKET_PATH
    }
 };