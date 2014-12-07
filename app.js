var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var usernames =[];
var users ={};
var mongoose = require('mongoose');
//app.get('/', function(req, res){
 // res.sendfile('index.html');
//});
mongoose.connect('mongodb://localhost/chatData', function(err){
	if(err){
		console.log(err);		
	}else{
		console.log('Connected to mongodb!');
	}
});
	
var chatSchema = mongoose.Schema({
	
   username: String,
   message: String,
   created:{type: Date, default:Date.now}	
	
});
	
var Chat = mongoose.model('Message', chatSchema);

io.on('connection', function(socket){
	
	Chat.find({},function(err,docs){
	console.log(docs);
	socket.emit('load old messages',docs);	
	});
	
  socket.on('new user', function(data,callback) {
  	   if(data in users){
  	   	callback(false);
  	   	console.log(" I am there");
  	   }else{
  	   	callback(true);
			socket.nickname = data;
			users[socket.nickname] =socket; 
			console.log(users);
		
			console.log(nicknames);
			io.sockets.emit('usernames',Object.keys(users));
			}
  	}); 



   socket.on('event:new:image',function(data){
        socket.broadcast.emit('event:incoming:image',data);
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
});('/', function(req, res){
  res.sendfile('index.html');
})