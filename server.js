var fs = require('fs');

var express = require('express');
var formidable = require('express-formidable');

var app = express();

app.use(express.static("public"));
app.use(formidable());

app.post('/create-post', function(req, res) {
  // Get Current Posts
  var currentPosts = {};
  fs.readFile(__dirname + '/data/posts.json', function (error, file) {
    currentPosts = JSON.parse(file);

    // Add new Post to Current Posts
    currentPosts[Date.now()] = req.fields.blogpost;

    // Write back to Posts.json
    fs.writeFile(__dirname + '/data/posts.json', JSON.stringify(currentPosts), function (error) { 
      if(error) {
        console.log(error);
      } else {
        res.redirect('/');
      }
    });
  });
});

app.get('/get-posts', function(req, res) {
  res.sendFile(__dirname + '/data/posts.json');
});

app.listen(3000, function () {
  console.log('Server is listening on port 3000. Ready to accept requests!');
});
