const mongoose =  require('mongoose')
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '用户名不能为空！'],
  },
  password: {
    type: String,
    required: [true, '密码不能为空！'] 
  },
  email: {
    type: String,
    required: [true, '邮箱不能为空！'] 
  },
  avatar: {
    type: String,
    default: 'images/default.png'
  },
  online: { // 是否在线
    type: Boolean
  },
  messages: {
    type: Array,
    default: []
  },
  token: {
    type: String
  },
  job: { // 职位
    type: String
  },
  company: { // 公司
    type: String
  },
  selfDesc: { // 个人介绍
    type: String
  },
  selfPage: { // 个人主页
    type: String
  },
  followeesCount: { // 关注
    type: Number,
    default: 0
  },
  followersCount: { // 粉丝
    type: Number,
    default: 0
  },
  totalLikesCount: { // 文章获得的赞
    type: Number,
    default: 0
  },
  totalViewsCount: { // 文章点击量
    type: Number,
    default: 0
  },
  key: {
    type: String,
  },
  created_at: { 
    type: Date, 
    default: Date.now
  }
})
const User = mongoose.model('user', userSchema)

module.exports = User