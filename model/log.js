const mongoose =  require('mongoose')
const articleSchema = new mongoose.Schema({
  type: { // 关注用户(follow)  文章发表(add)  文章更新(update)  喜欢文章(collection)  用户评论(comment)
    type: String,
    required: true 
  },
  entry: { // 文章
    type: Object
  },
  comment: { // 评论
    type: Object
  },
  followee: { // 关注的用户
    type: String,
    ref: 'user' // 表示关联user表
  },
  tags: {
    type: Array,
  },
  user: { // 操作的用户，先存userId，查询时关联查询
    type: String,
    required: true,
    ref: 'user' // 表示关联user表
  },
  check: { // 用户是否查看过
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date, 
    default: Date.now
  },
})
const Log = mongoose.model('log', articleSchema)

module.exports = Log