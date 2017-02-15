const express = require('express');
const mustacheExpress = require('mustache-express');
const l = require('lodash');
const cookieParser = require('cookie-parser');

const recipes_en = require('./all_recipes_en.json');
const recipes_ru = require('./all_recipes_ru.json');
const recipes_uk = require('./all_recipes_uk.json');

const LANG_DATA_MAP = {
    ru: recipes_ru,
    en: recipes_en,
    uk: recipes_uk
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
    const recipesData = getAllRecipes(req);
    const orderedRecipes = Object.assign(
        {},
        recipesData,
        {
            allRecipes: l.orderBy(
                l.flatten(recipesData.categories.map((category) => category.recipes)), 'title'
            )
        }
    );
    res.render('index', orderedRecipes);
});


app.get('/search', function(req, res) {
    const recipesData = getAllRecipes(req);

    const searchedItem = req.query.phrase.toLowerCase();
    const allRecipes = l.flatten(recipesData.categories.map((category) => category.recipes));
    const foundRecipes = l.filter(allRecipes, (recipe) => {
       return (
           recipe.title.toLowerCase().indexOf(searchedItem) !== -1  ||
           l.find(recipe.ingredients, (ingredient) => ingredient.toLowerCase().indexOf(searchedItem) !== -1)
       )
    });

    const orderedRecipes = Object.assign(
        {},
        recipesData,
        {
            allRecipes: l.orderBy(foundRecipes, 'title')
        }
    );
    res.render('index', orderedRecipes);
});

app.get('/:recipe', (req, res) => {
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
        currentCategory: Object.assign(
            {},
            individual_category,
            {
                recipes: l.orderBy(individual_category.recipes, 'title')
            }
        ),
        categories: recipesData.categories,
        translation: recipesData.translation
    });
});

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});