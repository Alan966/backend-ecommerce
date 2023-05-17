const MYSQL = require('../../connection');
const getAllSubcategories = async (req, res) => {
    const get_subcategorys_query = 'SELECT * FROM subcategories';
    const pool = await MYSQL.getPool();
    const get_subcategorys_result = await pool.query(get_subcategorys_query);
    if(get_subcategorys_result[0].length < 1){
        res
        .status(500)
        .json({
            success: false,
            message: 'Not found subcategories',
            subcategories: []
        })
    }

    res
    .status(200)
    .json({
        success: true,
        message: 'Subcategories found',
        subcategories: get_subcategorys_result[0]
    })
}

const getSubcategorysByIdCategory = async (req, res) => {
    console.log(req.params);
    const id_category = req.params.id_category;
    const query_select_by_id_category = `SELECT * FROM subcategories WHERE id_category = ?`;
    const pool = await MYSQL.getPool();
    const query_select_BY_id_subCategory = await pool.query(query_select_by_id_category, [id_category]);
    if(query_select_BY_id_subCategory[0].length < 1){
        res.
        status(500)
        .json({
            success: false,
            message: 'Not found subcategories',
        });
        return;
    }
    res.
    status(200)
    .json({
        success: true,
        message: 'Subcategories found',
        subcategories: query_select_BY_id_subCategory[0]
    })
};

async function getValidIdSubcategorie(){
    const id_subcategorie = Math.random() * 100000;
    const query_select_subcategorie = 'SELECT * FROM subcategories WHERE id_subcategorie = ?';
    const pool = await MYSQL.getPool();
    const query_select_subcategorie_result = await pool.query(query_select_subcategorie, [id_subcategorie]);
    if(query_select_subcategorie_result[0].length !== 0){
        getValidIdSubcategorie();
    }
    return id_subcategorie;
}

const createSubcategorie = async (req, res) => {

    if( !req.body.id_category || !req.body.name){
        res
        .status(400)
        .json({
            success: false,
            message: 'Have to send id_category and name'
        })
        return;
    }

    const query_create_subcategorie = 'INSERT INTO subcategories (id_subcategorie, id_category, name) VALUES (?, ?, ?)';
    const pool = await MYSQL.getPool();

    const subcategory_data = {
        id_subcategorie: await getValidIdSubcategorie(),
        id_category: parseInt(req.body.id_category),
        name: req.body.name
    }

    const create_subcategorie_result = await pool.query(query_create_subcategorie, Object.values(subcategory_data));
    if(create_subcategorie_result[0].affectedRows !== 1){
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
        message: 'Subcategorie created'
    });
}

module.exports = {
    getAllSubcategories,
    createSubcategorie,
    getSubcategorysByIdCategory
}