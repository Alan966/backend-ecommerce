const MYSQL = require('../../connection.js');
const formidable = require('formidable');
const { v4: uuid4 } = require('uuid');
const fs = require('fs');

const allPromotionsWelcome = async (req, res) => {
    const get_promotions_query = 'SELECT id_promotion, description, title FROM promotions';
    const pool = await MYSQL.getPool();
    const get_promotions_result = await pool.query(get_promotions_query);
    if(get_promotions_result[0].length < 1){
        res
        .status(500)
        .json({
            success: false,
            message: 'Not found promotions',
            promotions: []
        })
    }

    res
    .status(200)
    .json({
        success: true,
        message: 'Promotions found',
        promotions: get_promotions_result[0]
    })
}

const setPromotionsDatabase = async (req, res) =>   {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if(err){
            res
            .status(500)
            .json({
                success: false,
                message: 'Internal server error'
            });
            return;
        }

        const imgBuffer = fs.readFileSync(files.img.filepath);
        const { title, description } = fields;
        if(!title || !description){
            res
            .status(400)
            .json({
                success: false,
                message: 'Missing data'
            })
            return;
        }

        const user_data = {
            id_promotion: uuid4(),
            title,
            description,
            img: imgBuffer
        }

        const create_promotion_query = 'INSERT INTO promotions (id_promotion, title , description, img) VALUES (?, ?, ?, ?)';
        const pool = await MYSQL.getPool();
        const create_promotion_result = await pool.query(create_promotion_query, Object.values(user_data));
        if(create_promotion_result[0].affectedRows !== 1){
            res
            .status(500)
            .json({
                success: false,
                message: 'Internal server error'
            })
            return;
        }

        res
        .status(200)
        .json({
            success: true,
            message: 'Promotion created'
        })
    })
}

const getPhotoPromotiosn = async (req, res) => {
    const { id_promotion } = req.params;
    const get_promotion_query = 'SELECT * FROM promotions WHERE id_promotion = ?';
    const pool = await MYSQL.getPool();
    const get_promotion_result = await pool.query(get_promotion_query, [id_promotion]);
    if(get_promotion_result[0].length !== 1){
        res
        .status(404)
        .json({
            success: false,
            message: 'Promotion not found'
        })
        return;
    }

    const img = get_promotion_result[0][0].img;
    res
    .status(200)
    .setHeader('Content-Type', 'image/png')
    .send(img)
}

module.exports = {
    allPromotionsWelcome,
    setPromotionsDatabase,
    getPhotoPromotiosn
}