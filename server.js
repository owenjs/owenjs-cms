"use strict";
require('dotenv').config();

var path = require('path');
var fs = require('fs');
var express = require('express');

var formidable = require('./lib/formidable-middleware');
var db = require('./database');
var exphbs  = require('express-handlebars');

var app = express();

// Create `ExpressHandlebars` instance with a default layout.
var hbs = exphbs.create({
  partialsDir: "views/partials"
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Static Site 
app.use(express.static("public"));
// Admin Site
app.use('/admin', express.static(path.join(__dirname, 'admin', 'build')));
app.use(formidable());

app.get('/', function (req, res) {
  // Get Current Blog Posts
  db.getAll('blog_posts', 'posts').then((blogPosts) => {
    // Render Home with Current Blog Posts
    res.render('home', {
      blogPost: blogPosts
    });
  }).catch(() => {res.render('error', {layout: 'error', errorCode: '500'})});
});

app.get('/create-post', function(req, res) {
  res.render('create-post');
})

app.post('/', function(req, res) {
  if(req.fields.action == "create-post") {
    // Insert new Post in Database
    db.insert('blog_posts', 'posts', {
      title: req.fields.title,
      main: req.fields.main
    }, true).then(() => {
      // Render all Posts on Home Page
      db.getAll('blog_posts', 'posts').then((blogPosts) => {
        res.render('home', {
          blogPost: blogPosts
        });
      });
    }).catch(() => {res.render('error', {layout: 'error', errorCode: '500'})});
  }
});

// Admin Site
app.get('/admin/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'admin', 'build', 'index.html'));
});

app.listen(9000, function () {
  console.log('Server is listening on port 9000. Ready to accept requests!');
});
