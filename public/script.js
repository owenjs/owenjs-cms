if (document.readyState !== 'loading') {
  ready();
} else {
  document.addEventListener('DOMContentLoaded', ready);
}

function ready () {
  getBlogposts('/get-posts');
}

function getBlogposts (url) {
  fetch(url, {
      method: 'GET'
  })
  .then(function (res) {
      res.json()
      .then(function (json) {
          console.log(json);
          addBlogpostsToPage(json);
      });
  })
  .catch(function (err) {
      console.error(err)
  });
}

function addBlogpostsToPage (data) {
  for (var blogpost in data) {
      if (data.hasOwnProperty(blogpost)) {

          var postDiv         = document.createElement('div');
          var postText        = document.createElement('p');
          var thumbnail       = document.createElement('img');
          var postContainer   = document.querySelector('.post-container');

          thumbnail.src = "./img/logo2.png";
          thumbnail.className = "thumbnail";
          postText.innerHTML = data[blogpost];
          postDiv.className = "post";

          postDiv.appendChild(thumbnail);
          postDiv.appendChild(postText);
          postContainer.appendChild(postDiv);
      }
  }
}