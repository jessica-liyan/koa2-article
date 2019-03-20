const mongoose =  require('mongoose')
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true 
  },
  author: { // 前台提交作者id
    type: String,
    required: true,
    ref: 'user' // 表示关联user表
  },
  cover: { // 封面
    type: String
  },
  classify: { // 分类
    type: Object,
  },
  tag: {
    type: String,
  },
  collectionCount: { // 喜欢量
    type: Number,
    default: 0
  },
  commentsCount: { // 评论量
    type: Number,
    default: 0
  },
  viewsCount: { // 阅读量
    type: Number,
    default: 0
  },
  created_at: { 
    type: Date, 
    default: Date.now
  },
})
const Article = mongoose.model('article', articleSchema)

module.exports = Article