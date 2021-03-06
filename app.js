var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var passport = require('passport');
var config = require('./lib/config/config'); 
var db = require('./lib/db/mongo').db;
var modelsPath = path.join(__dirname, 'lib/models');
var socket = require('socket.io'); 
var usernames =[];
var users ={};
var sockets ={};
var server = http.createServer(app);
var io = socket.listen(server);
//var socket = require('./lib/controllers/socket.js');
app.use(express.static(path.join(__dirname, 'kranti/www')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(methodOverride());
fs.readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath + '/' + file);
});
var pass = require('./lib/config/pass');
var Chat = mongoose.model('chatMessage');
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
	//console.log('i AM ON');
	
	
	/*Chat.find({},function(err,docs){
	console.log(docs);
	socket.emit('load old messages',docs);	
	});*/
	
 socket.on('newUser', function(data){
    console.log(' I am on' + data.username  );
    socket.username = data.username;
	 socket.userId = users.length;
	
	users[data.username]= {
		username:data.username,
		userId: users.length
	};
	
	sockets[data.username] = socket;
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

socket.on('chatMessage', function(data){
console.log('THe chAT MESSAGE SOCKET IO IUS WORKING');
	 Chat.load(data.chatId, function(err, chatPage) {
    if (err)  console.log(err);
    if (!chatPage) console.log('the chatId is messed up');
  		console.log(chatPage);
    chatPage.message.push({name: data.username, mess:data.message});
    chatPage.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
     // res.json(blog);
     console.log('its workingg');
    }
  });
  console.log('the chatPage creator id'+ chatPage.creator._id);
  console.log('user id'+data.userId );
  console.log('chat message' + data.message);
  
	if(sockets[chatPage.blogger.username] != undefined && sockets[chatPage.creator.username] != undefined){
			console.log('This basically means that the message is to the blogger');
			console.log(chatPage.blogger.username);
			sockets[chatPage.blogger.username].emit('privateMessage',{message:data.message, username:data.username})	;
			sockets[chatPage.creator.username].emit('privateMessage',{message:data.message, username:data.username})	;
		}else{
			console.log('basicallky now its sending it to itself');
         sockets[data.username].emit('privateMessage',{message:data.message, username:data.username});
	}
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
require('./lib/config/route')(app);

app.set('port', process.env.PORT || 8000);

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});