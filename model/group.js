const mongoose = require('mongoose');

const { Schema } = mongoose;

const GroupSchema = new Schema({
  name: {
    type: String,
    index: true
  },
  avatar: {
    type: String,
    default: 'images/201807233eb5pgnzo3p.png'
  },
  desc: {
    type: String,
  },
  creator: {
    type: String,
    ref: 'user'
  },
  location: {
    type: String
  },
  members: [{
    type: String,
    ref: 'user'
  }],
  created_at: { 
    type: Date, 
    default: Date.now
  }
});

const Group = mongoose.model('Group', GroupSchema);
module.exports = Group