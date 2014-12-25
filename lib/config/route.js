var path = require('path'),
    auth = require('../config/auth');
    
module.exports = function(app) {

  var users = require('../controllers/users');
  app.post('/auth/users', users.create);
  app.get('/auth/users/:userId', users.show);

 // Check if username is available
  // todo: probably should be a query on users
  app.get('/auth/check_username/:username', users.exists);

  // Session Routes
  var session = require('../controllers/session');
  app.get('/auth/session', auth.ensureAuthenticated, session.session);
  app.post('/auth/session', session.login);
  
  var blogs = require('../controllers/blogs');
  app.get('/api/blogs', blogs.all);
  app.post('/api/blogs', auth.ensureAuthenticated, blogs.create);
  app.get('/api/blogs/:blogId', auth.ensureAuthenticated, auth.blog.hasAuthorization,blogs.show);
 // app.get('/api/blogs/:blogId', function(){ console.log('Hello World');});
  app.put('/api/blogs/:blogId', auth.ensureAuthenticated, auth.blog.hasAuthorization, blogs.update);
  app.delete('/api/blogs/:blogId', auth.ensureAuthenticated, auth.blog.hasAuthorization, blogs.destroy);
	/*app.post('/chat' ,function(req, res){
		console.log('I am OK');
		console.log(req.body);
		});*/
	var chat = require('../controllers/chat')	;
	app.post('/chat', chat.create);
	app.get('/chat', chat.all);
	app.get('/chat/:chatId', chat.message);
	app.get('/chatFind', chat.blog);
	/*app.get('/chatFind', function(req,res){
		console.log('Hello World omgggggggggggg');
		console.log(req);
		
	});*/
	app.get('/chatFind/:userId/:blogId', chat.check);
	
  //Setting up the blogId param
  app.param('blogId', blogs.blog);
 }