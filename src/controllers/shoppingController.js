const MYSQL = require("../../connection");
const { v4: uuid4 } = require('uuid');

const createShopping = async (req, res) => {
    const { id_users, id_producto, cantidad } = req.body;

    if(!id_users || !id_producto|| !cantidad){
        res.json({
            success: false,
            message: 'Missing data'
        })
        return;
    }

    const pool = await MYSQL.getPool();
    const query_create_shopping = `
    INSERT INTO shopping (id_shopping, id_users, id_producto, cantidad)
    VALUES (?, ?, ?, ?);`

    const body_query = {
        id_shopping: uuid4(),
        id_users: id_users,
        id_producto: id_producto,
        cantidad: cantidad
    }
    try {
        const response_query_create = await pool.query(query_create_shopping, Object.values(body_query));

        if(response_query_create.affectedRows === 0){
            res.json({
                success: false,
                message: 'Shopping not created'
            })
            return;
        }
        res.json({
            success: true,
            message: 'Shopping created'
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: 'Internal server error'
        })
    }
}

const getShoppingById = async (req, res) => {
    const {id_users } = req.params;
    if(!id_users){
        res.json({
            success: false,
            message: 'Missing data',
            products: []
        })
        return;
    }

    const pool = await MYSQL.getPool();
    const query_get_all_shopping = `
    SELECT * FROM shopping WHERE id_users = ?;`

    try {
        const result_get_shopping = await pool.query(query_get_all_shopping, id_users);

        res.json({
            success: true,
            message: 'Shopping',
            products: result_get_shopping[0]
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: 'Internal server error'
        })
    }
}

const deleteShoppingById = async (req, res) => {
    const { id_shopping } = req.params;
    if(!id_shopping){
        res.json({
            success: false,
            message: 'Missing data'
        })
        return;
    }

    const pool = await MYSQL.getPool();
    const query_delete_shopping = `
    DELETE FROM shopping WHERE id_shopping = ?;`

    try {
        const result_delete_shopping = await pool.query(query_delete_shopping, id_shopping);
        if(result_delete_shopping.affectedRows !== 1){
            res.json({
                success: false,
                message: 'Shopping not deleted'
            })
            return;
        }

        res.json({
            success: true,
            message: 'Shopping deleted'
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: 'Internal server error'
        })
    }
}

module.exports = {
    createShopping,
    getShoppingById,
    deleteShoppingById
}