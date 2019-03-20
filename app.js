const Koa = require('koa')
const IO = require('koa-socket')
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const logger = require('koa-logger')
const koaBody = require('koa-body')
const cors = require('koa2-cors')
const config = require('./config')
const session = require('koa-session2')

const index = require('./routes/index')

const app = new Koa()
const io = new IO()
io.attach(app)

// error handler
onerror(app)

// middlewares
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 连接数据库
const connect = require('./mongodb')
connect()

// 跨域
app.use(cors())
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200*1024*1024 // 设置上传文件大小最大限制，默认2M
  }
}))

// session
app.use(session({
  key: "SESSIONID"
}));

// 鉴权
const passport = require('koa-passport')
app.use(passport.initialize())
app.use(passport.session())

// routes
app.use(index.routes(), index.allowedMethods())

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log('错误啦', err.errors, err.message)
    // ctx.response.status = err.statusCode || err.status || 500;
    // validationError
    ctx.response.body = {
      status: 0,
      data: err.errors,
      msg: err.message
    };
  }
});

// error-handling
app.on('error', (err, ctx) => {
  //console.error('server error', err, ctx)
});

module.exports = app
