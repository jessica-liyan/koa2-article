const mongoose =  require('mongoose')
const friendSchema = new mongoose.Schema({
  followee: { // 被关注方
    type: String,
    required: true,
    ref: 'user'
  },
  follower: {  // 粉丝
    type: String,
    required: true,
    ref: 'user'
  },
  created_at: { 
    type: Date, 
    default: Date.now
  }
})
const Friend = mongoose.model('friend', friendSchema)

module.exports = Friend