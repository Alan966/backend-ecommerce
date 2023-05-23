const MYSQL = require('../../connection');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signin =  async (req, res) => {

    if( !req.body.password || !req.body.email){
        res.
        status(400)
        .json({
            success: false,
            message: 'Missing data'
        })
        return;
    }

    const pool = await MYSQL.getPool();
    const find_user_query = 'SELECT * FROM users WHERE email = ?';
    const signin = await pool.query(find_user_query, [req.body.email]);
    if(signin[0].length !== 1){
        res
        .status(404)
        .json({
            success: false,
            message: 'User not found'
        })
        return;
    }

    const email = signin[0][0].email;
    const password = signin[0][0].password
    const id_user = signin[0][0].id_users;
    const compare = await bycrypt.compare(req.body.password, password);
    if(compare !== true){
        res.
        status(401)
        .json({
            success: false,
            message: 'Wrong password'
        })
        return;
    }

    const secret = process.env.JWT_SECRET_KEY;

    const auth_token = jwt.sign({ id_user}, secret, {
        expiresIn: '1d',
    });
    res
    .status(200)
    .json({
        success: true,
        message: 'User logged in',
        auth_token,
        email: email,
        id_user: id_user
    })
    return;
}

module.exports = {
    signin
}