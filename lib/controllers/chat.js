'use strict';

var mongoose = require('mongoose'),
  Chat = mongoose.model('chatMessage');
var Blog = mongoose.model('BlogPost');
/**
 * Find chat by id
 */
exports.chatPage = function(req, res, next, id) {
  Chat.load(id, function(err, chatPage) {
    if (err) return next(err);
    if (!chatPage) return next(new Error('Failed to load chats ' + id));
    req.chatPage = chatPage;
    next();
  });
};

/**
 * Create a chat
 */
exports.create = function(req, res) {
  var blogMaker;
  var crea = req.body.creator._id;
  console.log(req.body.creator._id);
  //chat.creator = crea;
  //chat.blogId = req.blogId; 
   Blog.findOne({_id:req.body.blogId}, function(err, blog) {
   if (err) {
      	res.json(500, err);
   } else {
   	console.log(blog);
   	blogMaker= blog.creator;
   	var chat = new Chat({creator:crea, blogId:req.body.blogId , blogger:blogMaker});
  chat.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(chat);
    }
  });
   }
});
   
};

/**
 * Update a chat

exports.update = function(req, res) {
  var blog = req.blog;
  blog.title = req.body.title;
  blog.content = req.body.content;
  blog.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(blog);
    }
  });
};
*/
/**
 * Delete a blog
 
exports.destroy = function(req, res) {
  var blog = req.blog;

  blog.remove(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(blog);
    }
  });
};

/*
 * Show a blog
 */
 
exports.check = function(req, res) {
 Chat.findOne({creator:req.params.userId, blogId:req.params.blogId}).populate('creator blogId blogger').exec(function(err, chat) {
    if (err) {
      res.json(500, err);
    } else {
    	//console.log(chat);
    	//console.log('Holy shitt its working');
      res.json(chat);
    }
  });
};


 exports.all = function(req, res) {
	var userId =req.query.userId;
  Chat.find({creator:userId}).sort('-created').populate('creator blogId blogger').exec(function(err, chat) {
    if (err) {
      res.json(500, err);
    } else {
    	//console.log(chat);
    	//console.log('Holy shitt its working');
      res.json(chat);
    }
  });
};
 exports.blog = function(req, res) {
	var userId =req.query.usrId;
  Chat.find({blogger:userId}).sort('-created').populate('creator blogId blogger').exec(function(err, chat) {
    if (err) {
      res.json(500, err);
    } else {
    	console.log(chat);
    	console.log('Holy shitttttttttttttttttttttttttttttttttttttttttttt its working');
      res.json(chat);
    }
  });
};

exports.message = function(req,res){
	
	console.log(req.params.chatId);
	Chat.findOne({_id:req.params.chatId} , function(err, chat) {
    if (err) {
      res.json(500, err);
    } else {
    	console.log(chat);
    	//console.log('Holy shitt its working');
      res.json(chat.message);
    }
  });
};
/*exports.blog= function(req, res){
		var userId =req.query.usrId;
		var chats =[];
		var flag =false;
  		//console.log('Atleast its inthis');
  		
       Blog.find({creator:userId}, function(err, blog) {
   		 if (err) {
      	res.json(500, err);
   		 } else {
   		 	var id = blog[0]._id;
    			console.log(blog.length);
    		
    		for(var j=0;j<blog.length;j++){
    		console.log(j);
    			if(j == blog.length-1){
         		flag = true;	
         }
    		Chat.find({blogId:blog[j]._id}).populate('creator blogId').exec(function(err, chat) {
    		if (err) {
      		res.json(500, err);
   		 } else {
   		 	//console.log('its sending data');
   		   if(chat.length == 0){console.log('no chat to send')}
            else{
            	
            	console.log(' push to chat[0]');
            	chats.push(chat[0]);
            	console.log('pushed the first time     ' + j);
            	}
				
   	    }
   	    if(flag == true){
   	    	console.log('value of 11iiiiiiii' + j)
				console.log('its goddddddddd dammm here');
					 console.log(chats);
                res.json(chats);	
               flag = false;				
			}
	
  
         } );   }
        
    }
  });
	
};
*/