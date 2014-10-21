var express = require("express"),
app = express(),
methodOverride = require('method-override'),
bodyParser = require("body-parser"),
db = require("./models/index");

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

//Home
app.get('/', function(req, res){
  res.render('home');
});


///////////////// AUTHOR ROUTES  ///////////////////

//Index
app.get('/authors', function(req, res){
  db.Author.findAll().done(function(err,author){
    res.render('authors/index', {allAuthors: author});
  });
});

//News
app.get('/authors/new', function(req, res){
  res.render('authors/new');
});

//Create
app.post('/authors', function(req, res) {
  var name = req.body.author.name;
  db.Author.create({
    name: name
  }).done(function(err){
    res.redirect('/authors');
  });
});

//Show
app.get('/authors/:id/posts', function(req, res) {
  db.Author.find(req.params.id).done(function(err,author){
    author.getPosts().done(function(err,posts){
      res.render('authors/show', {allPosts: posts, author:author});
    });
  });
});

//Edit
app.get('/authors/:id/edit', function(req, res) {
  //find our author
  var id = req.params.id;
  db.Author.find(id).done(function(err,author){
    res.render('authors/edit', {author: author});
  });
});

//Update
app.put('/authors/:id', function(req, res) {
  var id = req.params.id;
  db.Author.find(id).done(function(err,author){
    author.updateAttributes({
      name: req.body.author.name
    }).done(function(err){
      res.redirect('/authors');
    });
  });
});

//Delete
app.delete('/authors/:id', function(req, res) {
  var id = req.params.id;
  db.Author.find(id).done(function(err,author){
    db.Post.destroy({
      where: {
        AuthorId: author.id
      }
    }).done(function(err){
      author.destroy().done(function(err){
        res.redirect('/authors');
        });
      });
    });
  });

//////// POSTS ROUTES ////////////

//Index
app.get('/posts', function(req, res){
  db.Post.findAll().done(function(err,posts){
    res.render('posts/index', {allPosts: posts});
  });
});

//New
app.get('/posts/new', function(req, res){
  var id = req.params.id;
  res.render('posts/new', {id:id, title:"",blog:""});
});

//Create
app.post('/posts/:id', function(req, res) {
  var AuthorId = req.params.id;
  var title = req.body.post.title;
  var blog = req.body.post.blog;

  db.Post.create({
    title: title,
    blog: blog,
    AuthorId: AuthorId
  }).done(function(err,post){
 	console.log("This is post:" + post);
      res.redirect('/authors/' + AuthorId + '/posts');
  });
});

//Show
app.get('/posts/:id', function(req, res) {
  db.Post.find(req.params.id).done(function(err,post){
    res.render('posts/show', {post: post});
  });
});

//Edit
app.get('/posts/:id/edit', function(req, res) {
  //find our post
  var id = req.params.id;
  db.Post.find(id).done(function(err,post){
    res.render('posts/edit', {post: post});
  });
});

//Update
app.put('/posts/:id', function(req, res) {
  var id = req.params.id;
  db.Post.find(id).done(function(err,post){
    post.getAuthor().done(function(err,author){
      post.updateAttributes({
      title: req.body.post.title
    }).done(function(err){
        res.redirect('/authors/' + author.id + '/posts');
     });
    });
  });
});

//Delete
app.delete('/posts/:id', function(req, res) {
  var id = req.params.id;
  db.Post.find(id).done(function(err,post){
    post.getAuthor().done(function(err,author){
      post.destroy().done(function(err){
        res.redirect('/authors/' + author.id + '/posts');
      });
    });
  });
});

// app.get('*', function(req,res){
//   res.render('404');
// });

app.listen(3000, function(){
  "Server is listening on port 3000";
});