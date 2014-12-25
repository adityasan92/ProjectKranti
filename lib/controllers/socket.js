'use strict';
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var usernames =[];
var users ={};
var Chat = mongoose.model('Message');

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