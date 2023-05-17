const MYSQL = require('../../connection');
const saltRounds = 10;
const bcrypt = require('bcrypt');
const { v4: uuid4} = require('uuid');
function encryptPassword(password){
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if(err){
                reject(err);
                return;
            }else{
                bcrypt.hash(password, salt, (err, hash) => {
                    resolve(hash);
                })
            }
        })
    })
}
const createUser = async (req, res) => {
    const { email , password, name, apellido, fecha_nacimiento, pais, sexo } = req.body;
    if( !email || !password || !name || !apellido || !fecha_nacimiento || !pais || !sexo){
        res.status(400).json({
            success: false,
            message: 'Missing data'
        })
        return;
    }
    const check_if_user_email_exists = 'SELECT * FROM users WHERE email = ?';
    const pool = await MYSQL.getPool()
    const check_if_user_email_exist_result = await pool.query(check_if_user_email_exists, [email]);
    if(check_if_user_email_exist_result[0].length > 0){
        res.status(400).json({
            success: false,
            message: 'Email already exists'
        })
        return;
    }
    const encryptedPassword = await encryptPassword(password);
    const insert_user = 'INSERT INTO users (id_users, email, password, name, apellido, fecha, pais, sexo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const id_users = uuid4();
    const user_data = {
        id_users,
        email,
        encryptedPassword,
        name,
        apellido,
        fecha_nacimiento,
        pais,
        sexo
    }
    const insert_user_result = await pool.query(insert_user, Object.values(user_data));
    res
    .status(200)
    .json({
        success: true,
        message: 'User created'
    })
    return;
}

module.exports = {
    createUser
}