"use strict";

var path = require('path');
var fs = require('fs');
var express = require('express');

var formidable = require('./lib/formidable-middleware');
var exphbs  = require('express-handlebars');

var app = express();

// Create `ExpressHandlebars` instance with a default layout.
var hbs = exphbs.create({
  partialsDir: "views/partials"
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.static("public"));
app.use(formidable());

app.get('/', function (req, res) {
  // Get Current Blog Posts
  fs.readFile(__dirname + '/data/posts.json', function (error, file) {
    // Render Home with Current Blog Posts
    res.render('home', {
      blogPost: JSON.parse(file)
    });
  });
});

app.get('/create-post', function(req, res) {
  res.render('create-post');
})

app.post('/', function(req, res) {
  if(req.fields.action == "create-post") {
    // Get Current Posts
    fs.readFile(__dirname + '/data/posts.json', function (error, file) {
      var currentPosts = JSON.parse(file);

      // Add new Post to Current Posts
      currentPosts.push({
        title: req.fields.title,
        main: req.fields.main,
      });

      // Write back to Posts.json
      fs.writeFile(__dirname + '/data/posts.json', JSON.stringify(currentPosts), function (error) { 
        if(error) {
          console.log(error);
        } else {
          res.render('home', {
            blogPost: currentPosts
          });
        }
      });
    });
  }
});

app.listen(3000, function () {
  console.log('Server is listening on port 3000. Ready to accept requests!');
});
