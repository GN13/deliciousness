const express = require('express');
const mustacheExpress = require('mustache-express');
const l = require('lodash');
const cookieParser = require('cookie-parser');

const recipes_en = require('./all_recipes.json');
const recipes_ru = require('./all_recipes_ru.json');

const LANG_DATA_MAP = {
    ru: recipes_ru,
    en: recipes_en,
};

const getAllRecipes = (req) => LANG_DATA_MAP[req.cookies.lang] || LANG_DATA_MAP['en'];

const app = express();

app.set('port', (process.env.PORT || 3000));
app.use(express.static('public'));

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', 'views');

app.use(cookieParser());
app.use((req, res, next) => {
    if (!req.cookies.lang) {
        const lang = req.acceptsLanguages('en', 'ru');
        req.cookies.lang = lang;
        res.cookie('lang', lang, {maxAge: 900000, httpOnly: false});
    }
    next()
});

app.get('/', (req, res) => {
    res.render('index', getAllRecipes(req));
});

app.get('/all_recipes/:recipe', (req, res) => {
    const recipesData = getAllRecipes(req);
    const allRecipes = recipesData.categories.map((category) => category.recipes);
    const currentRecipe = l.find(l.flatten(allRecipes), {name: req.params.recipe});
    res.render('individual_recipe', {
        currentRecipe,
        categories: recipesData.categories,
        translation: recipesData.translation
    });
});

app.get('/category/:category', (req, res) => {
    const recipesData = getAllRecipes(req);
    const individual_category = l.find(recipesData.categories, {category_name: req.params.category});
    res.render('category', {
        currentCategory: individual_category,
        categories: recipesData.categories
    });
});

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});