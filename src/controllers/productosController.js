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

        console.log({
            name, price, id_marca, id_subcategories, cantidad
        });
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

module.exports = {
    createProducto
}