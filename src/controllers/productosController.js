const formidable = require('formidable');
const { v4: uuid4 } = require('uuid');
const MYSQL = require('../../connection.js');
const fs = require('fs');

const createProducto = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if(err){
            res
            .status(500)
            .json({
                success: false,
                message: 'Internal server error'
            })
            return;
        }

        const imageOneBuffer = fs.readFileSync(files.img_one.filepath);
        const imageTwoBuffer = fs.readFileSync(files.img_two.filepath);
        const imageThreeBuffer = fs.readFileSync(files.img_three.filepath);
        const imageFourBuffer = fs.readFileSync(files.img_four.filepath);

        const {name, price, id_marca, id_subcategories, cantidad } = fields;
        if(
            !name ||
            !price ||
            !id_marca ||
            !id_subcategories ||
            !cantidad
        ){
            res
            .status(400)
            .json({
                success: false,
                message: 'Missing data'
            })
            return;
        }

        const product_data = {
            id_producto: uuid4(),
            name,
            price,
            id_marca,
            id_subcategories,
            img_one: imageOneBuffer,
            img_two: imageTwoBuffer,
            img_three: imageThreeBuffer,
            img_four: imageFourBuffer,
            cantidad
        }

        const create_product_query = `INSERT INTO productos(
            id_producto,
            name,
            price,
            id_marca,
            id_subcategories,
            img_one,
            img_two,
            img_three,
            img_four,
            cantidad
        )
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const pool = await MYSQL.getPool();

        try {
            const create_product_result = await pool.query(create_product_query, Object.values(product_data));
            if(create_product_result[0].affectedRows !== 1){
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
                    message: 'Product created'
                })
        } catch (error) {
            console.log(error);
            res
            .status(500)
            .json({
                success: false,
                message: 'Internal server error'
            })
        }
    })
}

const getProductoBySubcategory = async (req, res) => {
    const { id_subcategories } = req.params;

    const get_productos_query_by_subcategory = `SELECT
        id_producto,
        name,
        price,
        id_marca,
        id_subcategories,
        cantidad
    FROM productos WHERE id_subcategories = ?`;
    const pool = await MYSQL.getPool();

    try {
        const result_query_by_subcategory = await pool.query(get_productos_query_by_subcategory, [id_subcategories]);
        if(result_query_by_subcategory[0].length === 0){
            res
            .status(400)
            .json({
                success: false,
                message: 'No products found'
            })
            return;
        }

        res.json({
            success: true,
            productos: result_query_by_subcategory[0]
        })
    } catch (error) {
        console.log(error);
    }
}
const getProductoByCategory = async (req, res) => {
    const {id_category } = req.params;

    const query_get_productos_by_category = `SELECT
     P.id_producto,
     P.name,
     P.price,
     P.id_marca,
     P.id_subcategories,
     P.cantidad,
     C.name AS category
     FROM productos P INNER JOIN subcategories S ON P.id_subcategories = S.id_subcategorie
     INNER JOIN categories C ON S.id_category = C.id_category WHERE C.id_category = ?
     `;

    const pool = await MYSQL.getPool();

    try {
        const query_get_productos_result = await pool.query(query_get_productos_by_category, [id_category]);

        if(query_get_productos_result[0].length < 1){
            res.json({
                success: false,
                message: 'No products found'
            })
            return;
        }

        res.json({
            success: true,
            productos: query_get_productos_result[0],
            category: query_get_productos_result[0][0].category
        })
    } catch (error) {
        console.log(error);
        res
        .json({
            success: false,
            message: 'Internal server error'
        })
    }
}
const getProductosByIdSubcategory = async (req, res) => {
    const { id_subcategories }  = req.params;

    const query_get_subcategories_by_id_subcategory = `
    SELECT
    P.id_producto,
    P.name,
    P.price,
    P.id_marca,
    P.id_subcategories,
    P.cantidad,
    S.name AS subcategory
    FROM productos P INNER JOIN subcategories S ON P.id_subcategories = S.id_subcategorie WHERE S.id_subcategorie = ?`

    const pool = await MYSQL.getPool();

    try {
        const result_get_subcategories_by_id_subcategory = await pool.query(query_get_subcategories_by_id_subcategory, [id_subcategories]);
        if(result_get_subcategories_by_id_subcategory[0].length < 1){
            res.json({
                success: false,
                message: 'No products found'
            })
            return;
        }
        res.json({
            success: true,
            productos: result_get_subcategories_by_id_subcategory[0],
            subcategory: result_get_subcategories_by_id_subcategory[0][0].subcategory
        })
    }
    catch(err){
        console.log(err)
        res.json({
            success: false,
            message: 'Internal server error'
        })
    }
}

const getImgByIdProdcuto = async (req, res) => {
    const { img } = req.params;
    const { id_producto } = req.params;

    const query_get_img_by_id_prodcuto = `
    SELECT ${img} FROM productos WHERE id_producto = ?`;
    const pool = await MYSQL.getPool();

    try {
        const result_query_get_photo = await pool.query(query_get_img_by_id_prodcuto, [id_producto]);
        if(result_query_get_photo[0].length !== 1){
            res
            .status(400)
            .json({
                success: false,
                message: 'Img not found'
            })
            return;
        }

        res
        .status(200)
        .setHeader('Content-Type', 'image/png')
        .send(result_query_get_photo[0][0][img]);
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: 'Internal server error'
        })
    }
};

const getPhotobySubcategory = async (req, res) => {
    const { id_subcategories } = req.params;
    const img = req.params.img;
    const query_get_photo_one = `
    SELECT ${img} FROM productos WHERE id_subcategories = ?`;

    const pool = await MYSQL.getPool();

    try {
        const result_query_photo_one = await pool.query(query_get_photo_one, [id_subcategories]);
        if(result_query_photo_one[0].length === 0){
            res
            .status(400)
            .json({
                success: false,
                message: 'No products found'
            })
            return;
        }
        res
        .status(200)
        .setHeader('Content-Type', 'image/png')
        .send(result_query_photo_one[0][0].img_four)
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: 'Internal server error'
        })
    }
}

const getProductsByIdUsers= async (req, res) => {
    const { id_users } = req.params;

    if(!id_users){
        res.json({
            success: false,
            message: 'No products found'
        })
        return;
    }

    const query_get_product_by_id_users  = `
    SELECT P.id_producto, P.name, P.price, M.name AS marca, S.name AS nameSubcategory, C.id_shopping, C.cantidad
    FROM productos P INNER JOIN marcas M ON P.id_marca = M.id_marca
    INNER JOIN subcategories S ON P.id_subcategories = S.id_subcategorie
    INNER JOIN shopping C ON P.id_producto = C.id_producto
    INNER JOIN users U ON C.id_users = U.id_users WHERE U.id_users = ?`;

    const pool = await MYSQL.getPool();
    try {
        const resul_query_get_product_by_id_users = await pool.query(query_get_product_by_id_users, [id_users]);

        if(resul_query_get_product_by_id_users[0].length < 1){
            res.json({
                success: false,
                message: 'No products found'
            })
            return;
        }

        res.json({
            success: true,
            products: resul_query_get_product_by_id_users[0]
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
    createProducto,
    getProductoBySubcategory,
    getPhotobySubcategory,
    getProductoByCategory,
    getImgByIdProdcuto,
    getProductosByIdSubcategory,
    getProductsByIdUsers
}