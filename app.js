const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

db.once('open', () => {
    console.log("connected to mongodb");
});

db.on('error', (err) =>{
    console.log(err);
});

const app = express();

let Article = require('./models/article');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());
app.use('/bootstrap', express.static(__dirname + '../node_modules/bootstrap/dist/css/'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    Article.find({}, (err, articles) => {
        if(err){
            console.log(err);
        }
        else{
            res.render('index', {
                title:'Articles',
                articles: articles
            });
        }     
    });
});

app.get('/articles/add', (req, res) =>{
    res.render('add_article', {
        title:'Add Article'
    });
});

app.post('/articles/add', (req, res) =>{
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save((err) =>{
        if(err){
            console.log(err);
            return;
        }
        else {
            res.redirect('/');
        }
    });
});

app.post('/articles/edit/:id', (req, res) =>{
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id:req.params.id}
    
    Article.update(query, article, (err) => {
        if(err){
            console.log(err);
            return;
        }
        else {
            res.redirect('/');
        }
    });   
});

app.get('/article/:id', (req, res ) =>{
    Article.findById(req.params.id, (err, article) => {
        res.render('article', {
            article:article
        });
    });
});

app.get('/article/edit/:id', (req, res) =>{
    Article.findById(req.params.id, (err, article) => {
        res.render('edit_article', {
            title:article.title,
            article:article
        });
    });
});

app.listen(3000, () => {
    console.log('server started on port 3000');
});