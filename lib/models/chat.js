var mongoose = require('mongoose');

var chatSchema = mongoose.Schema({
	
   username: String,
   message: String,
   created:{type: Date, default:Date.now}	
	
});

mongoose.model('Message', chatSchema);
