var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var passport = require('passport');
var passportSocketIo = require('passport.socketio');
var db = require('./lib/db/mongo').db;
var usernames =[];
var users ={};
var Chat = mongoose.model('Message');
var pass = require('./lib/config/pass');
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath + '/' + file);
});
app.use(cookieParser());
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({
  key: 'express.aditya'
  secret: 'MEAN',
  saveUninitialized: true,
  resave: true,
  store: new mongoStore({
    url: config.db,
    collection: 'sessions',
    
  })
}));
var pass = require('./lib/config/pass');
app.use(passport.initialize());
app.use(passport.session());

io.use(passportSocketIo.authorize({
  cookieParser: express.cookieParser,
  key:         'express.aditya',       // the name of the cookie where express/connect stores its session_id
  secret:      'MEAN',    // the session_secret to parse the cookie
  store:       mongoStore,        // we NEED to use a sessionstore. no memorystore please
  success:     onAuthorizeSuccess,  // *optional* callback on success - read more below
  fail:        onAuthorizeFail,
	
}));

// use passport session



io.on('connection', function(socket){
	
	Chat.find({},function(err,docs){
	console.log(docs);
	socket.emit('load old messages',docs);	
	});
	
  	socket.on('log in', function(data){
  		
  		console.log(data);
  		var session = require('./lib/controllers/session');
  		session.login(data);
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



http.listen(8000, function(){
  console.log('listening on *:8000');
});
