const passport = require('koa-passport')
const Strategy = require('passport-http-bearer').Strategy;
const jsonwebtoken = require('jsonwebtoken')
const secret = require('../config').secret
const User = require('../model/user')

passport.use(new Strategy(async (token, done) => {
  try {
    jsonwebtoken.verify(token, secret).data  // token失效监控
    const user = await User.findOne({token})  // token比对
    if(user){
      return done(null, user)
    }else {
      return done(null, false)
    }
  } catch (err){
    return done(err)
  }
}))

module.exports.isAuthenticated = () => {
  return passport.authenticate('bearer', {session: false})
}
