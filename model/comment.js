const mongoose =  require('mongoose')
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  targetId: { // 文章id
    type: String,
    default: ''
  },
  parentId: { // 子评论父级id
    type: String,
    default: ''
  },
  user: { // 评论人的id
    type: String,
    required: true,
    ref: 'user' // 表示关联user表
  },
  children: { // 子评论数组
    type: Array,
  },
  created_at: {
    type: Date, 
    default: Date.now
  },
})
const Comment = mongoose.model('comment', commentSchema)

module.exports = Comment