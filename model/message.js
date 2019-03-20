const mongoose =  require('mongoose')
const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  to: { // 接收消息的id
    type: String,
    required: true,
    ref: 'user' // 表示关联user表
  },
  from: { // 发出消息的id
    type: String,
    required: true,
    ref: 'user' // 表示关联user表
  },
  type: { // 消息类型
    type: String,
    required: true
  },
  created_at: {
    type: Date, 
    default: Date.now
  },
})
const Message = mongoose.model('message', messageSchema)

module.exports = Message