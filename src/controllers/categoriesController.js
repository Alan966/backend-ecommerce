const MYSQL = require('../../connection');
const { v4: uuid4 } = require('uuid');
const getCategorys = async (req, res) => {
    const query_select_categorys = 'SELECT * FROM categories ORDER BY id_category DESC';
    const pool = await MYSQL.getPool();
    const query_select_result = await pool.query(query_select_categorys);
    if(query_select_result[0].length < 1){
        res
        .status(500)
        .json({
            success: false,
            message: 'Not found categorys',
            categorys: []
        })
        return;
    }

    res
    .status(200)
    .json({
        success: true,
        message: 'Categorys found',
        categorys: query_select_result[0]
    })
};

const createCategory = async (req, res) => {

    if( !req.body.name){
        res.
        status(400)
        .json({
            success: false,
            message: 'The name is required'
        })
        return;
    }

    const pool = await MYSQL.getPool();
    const query_create_category = 'INSERT INTO categories (id_category, name) VALUES (?, ?)';
    const category_data = {
        id_category: parseInt(uuid4()),
        name: req.body.name
    }
    const query_create_result = await pool.query(query_create_category, Object.values(category_data));
    if(query_create_result[0].affectedRows !== 1){
        res.
        status(500)
        .json({
            success: false,
            message: 'Internal server error'
        })
        return;
    }
    res.
    status(200)
    .json({
        success: true,
        message: 'Category created'
    })
};

module.exports = {
    getCategorys,
    createCategory
}