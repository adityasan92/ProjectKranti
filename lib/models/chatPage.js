'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ChatPageSchema = new Schema({

  message: {
    type: [],
    name: String,
    mess: String, 
    trim: true
  },
  created: Date,
  updated: [Date],
  creator: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  blogId:{
  	type: Schema.ObjectId,
    ref: 'BlogPost'
  }, 
  blogger:{
  	type: Schema.ObjectId,
    ref: 'User'
  }
});

ChatPageSchema.pre('save', function(next, done){
 console.log('Its coming here');
  if (this.isNew)
    this.created = Date.now();

  this.updated.push(Date.now());

  next();
});

ChatPageSchema.statics = {
  load: function(id, cb) {
    this.findOne({
      _id: id
    }).populate('creator blogId blogger').exec(cb);
  }
};

mongoose.model('chatMessage', ChatPageSchema);

