var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var passport = require('passport');
var config = require('./lib/config/config');
var usernames =[];
var users ={};

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'kranti/www')));
app.set('views', __dirname + '/kranti/www/views');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(methodOverride());
var pass = require('./lib/config/pass');
var db = require('./lib/db/mongo').db;


var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath + '/' + file);
});

var Chat = mongoose.model('Message');
var pass = require('./lib/config/pass');

var auth = function(req,res,next){
	if(!req.isAuthenticated())
		res.send(401);
	else 
		next();
};
app.use(session({
  secret: 'MEAN',
  saveUninitialized: true,
  resave: true,
  store: new mongoStore({
    url: config.db,
    collection: 'sessions',
    
  })
}));

// use passport session
app.use(passport.initialize());
app.use(passport.session());


io.on('connection', function(socket){
	
	Chat.find({},function(err,docs){
	console.log(docs);
	socket.emit('load old messages',docs);	
	});
	

  	
  	socket.on('log in', function(data){
  		
  		console.log(data);
  		//var session = require('./lib/controllers/session');
  		//session.login(data);
  	});


  socket.on('send message', function(msg){
    console.log('message: ' + msg.user );
    socket.user = msg.user;
    users[socket.user] =socket;
	 
	 var newMsg = Chat({message:msg.message, username:socket.user});
	 newMsg.save(function(err){  
	 if(err)throw err;
	 io.sockets.emit('get message',{ message:msg.message, username:socket.user });
	 
	 });
	
  });
  
  socket.on('disconnect', function(data){
  		if(!socket.nickname) return;
  		delete users[socket.nickname];
  		
  		io.sockets.emit('usernames',users);
  	});
  	
});
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

//Bootstrap routes
//require('./lib/config/routes')(app);

http.listen(8000, function(){
  console.log('listening on *:8000');
});