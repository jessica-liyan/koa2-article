const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const User = require('../model/user')
const secret = require('../config').secret

class AuthController {
  static async test (ctx) {
    ctx.body = 'hello world'
  }

  // 注册
  static async register(ctx) {
    const params = ctx.request.body

    const hasEmail = await User.findOne({
      email: params.email
    })
    const hasName = await User.findOne({
      name: params.name
    })
    if(hasEmail){
      ctx.body = {
        status: 0,
        msg: '邮箱已经被注册！'
      }
      return
    }
    if(hasName){
      ctx.body = {
        status: 0,
        msg: '用户名已经被注册！'
      }
      return
    }

    const user = await User.create({
      name: params.name,
      password: params.password,
      email: params.email,
      avatar: params.avatar
    });
    user.password = bcrypt.hashSync(user.password, 5)
    user.save()
    ctx.body = {
      status: 1,
      msg: '注册成功！',
      data: user
    }
  }

  static async login (ctx) {
    const user = await User.findOne({
      email: ctx.request.body.email
    })
    if (!user) {
      ctx.body = {
        status: 0,
        msg: '用户不存在！',
      }
      return
    }
    const checkPass = bcrypt.compareSync(ctx.request.body.password, user.password)
    if (checkPass) {
      const token = jsonwebtoken.sign({
        data: user._id,
        exp: Math.floor(Date.now() / 1000) + (10*3600) // 5小时之后过期
      }, secret)
      user.token = token
      user.save()

      ctx.body = {
        status: 1,
        msg: '登录成功！',
        data: user,
        token: token
      }
    } else {
      ctx.body = {
        status: 0,
        msg: '密码错误！'
      }
    }
  }

  static async logout (ctx) {
    // 清除数据库中的token
    const user = ctx.state.user
    user.token = ''
    user.save()

    ctx.body = {
      status: 1,
      msg: '成功退出！'
    }
  }
}

module.exports = AuthController