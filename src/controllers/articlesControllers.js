const  formidable = require("formidable");
const  fs = require("fs");
const { v4: uuid4 } = require('uuid');
const  MYSQL = require("../../connection");
const createArticle = async (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, async(err, fields, files) => {
        if(err){
            res
            .json({
                success: false,
                message: 'Internal server error'
            })
            return;
        }


        const img_two = fs.readFileSync(files.img_two.filepath);
        const img_three = fs.readFileSync(files.img_three.filepath);


        const {p_one, p_two, p_three, title, title_two} = fields;

        if(
            !title ||
            !p_one ||
            !p_two ||
            !p_three ||
            !img_two ||
            !img_three
        ){
            res.json({
                success: false,
                message: 'Missing data'
            })
            return;
        }

        const query_article_data = {
            id_article: uuid4(),
            p_one: p_one,
            p_two: p_two,
            p_three: p_three,
            img_two: img_two,
            img_three: img_three,
            title_two: title_two,
            title: title
        }

        const query_insert_article = `
        UPDATE articles
        SET
        id_article = ?,
        p_one = ?,
        p_two = ?,
        p_three = ?,
        img_two = ?,
        img_three = ?,
        title_two = ?
        WHERE title = ?;`
        const pool = await MYSQL.getPool();
        try {
            const result_query_insert_article = await  pool.query(query_insert_article, Object.values(query_article_data));
            if(result_query_insert_article.affectedRows === 0){
                res.json({
                    success: false,
                    message: 'Article not found'
                })
                return;
            }

            res.json({
                success: true,
                message: 'Article updated'
            })
        } catch (error) {
            console.log(error);
            res.json({
                success: false,
                message: 'Internal server error'
            })
        }
    })
}

const getArticleByIdPromotion = async (req, res) => {
    const { id_promotion } = req.params;
    if(!id_promotion){
        res.json({
            success: false,
            message: 'Missing data'
        })
        return;
    }


    const query_get_article_by_id_promotion = `
    SELECT A.id_article, A.title_two, A.p_one, A.p_two, A.p_three, A.title
    FROM articles A INNER JOIN
    promotions P ON A.title = P.title WHERE P.id_promotion = ?;`

    const pool = await MYSQL.getPool();

    try {
        const result_query_get_article_by_id_promotion = await pool.query(query_get_article_by_id_promotion, [id_promotion]);
        if(result_query_get_article_by_id_promotion[0].length !== 1){
            res.json({
                success: false,
                message: 'Article not found'
            })
            return;
        }

        res.json({
            success: true,
            message: 'Article found',
            article: result_query_get_article_by_id_promotion[0][0]
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: 'Internal server error'
        })
    }
}

const getPhotoByIdArticle = async (req, res) => {
    const { img, id_article } = req.params;
    if( !id_article ||
        !img){
        res
        .json({
            success: false,
            message: 'Missing data'
        })
        return
    }

    const query_get_photo_by_id_article = `
    SELECT ${img} FROM articles WHERE id_article = ?`;

    const pool = await MYSQL.getPool();

    try {
        const result_query_get_photo_by_id_article = await pool.query(query_get_photo_by_id_article, [id_article]);

        if(result_query_get_photo_by_id_article[0].length !== 1){
            res.json({
                success: false,
                message: 'Article not found'
            })
            return;
        }

        res
        .status(200)
        .contentType('image/png')
        .send(result_query_get_photo_by_id_article[0][0][img]);

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: 'Internal server error'
        })
    }
}

const allArticles = async (req, res) => {
    const query_get_all_articles  = ` SELECT title_two, id_article, title, id_promotion FROM articles`
    const pool = await MYSQL.getPool();

    try {
        const result_query_all_articles = await pool.query(query_get_all_articles);
        if(result_query_all_articles[0].length < 1){
            res.json({
                success: false,
                message: 'Articles not found'
            })
            return;
        }

        res.json({
            success: true,
            message: 'Articles found',
            articles: result_query_all_articles[0]
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
    createArticle,
    getArticleByIdPromotion,
    getPhotoByIdArticle,
    allArticles
}