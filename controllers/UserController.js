const jsonwebtoken = require('jsonwebtoken')
const User = require('../model/user')
const Log = require('../model/log')
const Socket = require('../model/socket')
const Article = require('../model/article')
const Message = require('../model/message')
const secret = require('../config').secret

class UserController {
  // 用户列表 token
  static async list (ctx) {
    const id = ctx.state.user._id
    const users = await User.find({'_id': {$ne: id}}, 'name avatar online lastMsg').sort({online: -1})

    await users.map(async (item) => {
      // 是否在线
      let socket = await Socket.findOne({user: item._id})
      if(socket){
        item.online = true
      } else {
        item.online = false
      }

      item.save() 
    })

    ctx.body = {
      status: 1,
      msg: '获取用户列表成功！',
      data: users
    }
  }

  // 热门前五用户（粉丝前五用户） /user/top5
  static async getTopFive (ctx) {
    const users = await User.find({}, 'name avatar followersCount').sort({followersCount: -1}).limit(5)
    ctx.body = {
      status: 1,
      msg: '用户前五列表获取成功！',
      data: users
    }
  }


  // 用户个人信息 /user  token
  static getSelf (ctx) {
    ctx.body = {
      status: 1,
      msg: 'success',
      data: ctx.state.user
    }
  }

  // 我的资料 user/:id  token
  static async info (ctx) {
    let user = await User.findById(ctx.params.id)
    ctx.body = {
      status: 1,
      msg: '用户信息获取成功！',
      data: user
    }
  }

  // 我的动态 user/:id/log  token
  static async log (ctx) {
    const logs = await Log.find({user: ctx.params.id}).populate({ path: 'followee'}).sort({created_at: -1})
    ctx.body = {
      status: 1,
      msg: '用户日志获取成功！',
      data: logs
    }
  }

  // 我的喜欢 user/:id/like  token
  static async like (ctx) {
    const logs = await Log.find({user: ctx.params.id, type: 'collection'}).sort({created_at: -1})
    ctx.body = {
      status: 1,
      msg: '用户喜欢列表获取成功！',
      data: logs
    }
  }

  // 我的发布 user/:id/post token
  static async post (ctx) {
    const articles = await Article.find({'author': ctx.params.id}).sort({created_at: -1})
    ctx.body = {
      status: 1,
      msg: '该用户文章列表获取成功！',
      data: articles
    }
  }

  // 更新用户资料 user/update   token
  static async update (ctx) {
    const user = await User.findOne({_id: ctx.request.body._id})
    if(!user){
      ctx.body = {
        status: 0,
        msg: '用户不存在！'
      }
      return
    }
    User.update({_id: ctx.request.body._id}, {$set: ctx.request.body}).exec()
    ctx.body = {
      status: 1,
      msg: '用户资料更新成功！'
    }
  }

  // 用户消息列表   /notification/:id   token
  static async notification (ctx) {
    let logs = await Log.find({ 
      $or: [
        {'entry.author': ctx.params.id, type: 'collection'},
        {'entry.author': ctx.params.id, type: 'comment'},
        {'followee': ctx.state.user._id, type: 'follow'}
      ]
    }).update({check: false}, {check: true}, {multi: true}).populate({ path: 'user', select: 'name avatar job company'}).sort({created_at: -1}).exec()

    ctx.body = {
      status: 1,
      msg: 'ok',
      data: logs
    }
    
  }

  // 获取未读消息数量
  static async getNotificationNum (ctx) {
    const logs = await Log.find({ 
      $or: [
        {'entry.author': ctx.params.id, type: 'collection', check:false},
        {'entry.author': ctx.params.id, type: 'comment', check:false},
        {'followee': ctx.state.user._id, type: 'follow', check:false}
      ]
    }).count()
    ctx.body = {
      status: 1,
      msg: 'ok',
      count: logs
    }
  }

  static getUserInfo (token) {
    return jsonwebtoken.verify(token, secret).data
  }
}

module.exports = UserController
