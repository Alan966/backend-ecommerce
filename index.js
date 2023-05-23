const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Signup = require('./src/routes/signupRoutes.js');
const Signin = require('./src/routes/signinRoutes.js');
const Promotions = require('./src/routes/promotionsRouter.js');
const Categories = require('./src/routes/categoriesRoutes.js');
const SubCategories = require('./src/routes/subCategoriesRoutes.js');
const Productos = require('./src/routes/productosRouter.js');
const Articles = require('./src/routes/articlesRoutes.js');
const Shopping = require('./src/routes/shoppingRouter.js');

dotenv.config();

app.set('port', process.env.PORT || 5000);

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

const KauthenticationPaths = new Set([
    '/promotions',
    '/signin',
    '/signup',
]);

app.use(async (req, res, next) => {
    if(req.method === 'GET' || KauthenticationPaths.has(req.path)){
        next()
        return;
    }

    const bearer_token = req.rawHeaders.find((header) => header.includes('Bearer'));
    if(!bearer_token){
        res.
        status(401)
        .json({
            success: false,
            message: 'Unauthorized'
        })
        return;
    }

    const auth_token = bearer_token.split(' ')[1];
    try{

        const secret = process.env.JWT_SECRET_KEY;
        let decoded = jwt.verify(auth_token, secret);
            if(!decoded.id_user){
                console.log('No signin');
                res.
                status(401)
                .json({
                    success: false,
                    message: 'Unauthorized'
                })
                return;
            }
            next();
    }
    catch(err){
        console.log(err);
        res.
        status(401)
        .json({
            success: false,
            message: 'Unauthorized'
        })
        return;
    }
})

app.use('/promotions',  Promotions);
app.use('/signin', Signin);
app.use('/signup', Signup);
app.use('/categories', Categories);
app.use('/subcategories', SubCategories);
app.use('/productos', Productos);
app.use('/articles', Articles)
app.use('/shopping', Shopping);

app.listen(app.get('port'), ()=> {
    console.log(`Server running on port ${app.get('port')}`);
});