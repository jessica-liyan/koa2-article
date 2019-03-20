const Article = require('../model/article')
const User = require('../model/user')
const Log = require('../model/log')

class ArticleController {
  // 获取文章列表，分类 /article  /article/:type ?page=0&limit=4
  static async list (ctx) {
    let articles
    let total
    if(ctx.params.type){
      articles = await Article.find({'classify.title': ctx.params.type}).populate({ path: 'author'}).sort({created_at: -1})
      total = articles.length
    }else{
      articles = await Article.find({}).populate({ path: 'author'}).sort({created_at: -1})
      total = articles.length
    }
    
    let limit = Number(ctx.query.limit) || 20  // 每页条数
    let page = Number(ctx.query.page) || 1 // 页码，从1开始
    articles = articles.splice((page - 1) * limit, limit)

    ctx.body = {
      status: 1,
      msg: '文章列表获取成功！',
      total: total, // 总条数
      data: articles,
      page: page, // 当前页数
      limit: limit // 每页条数
    }
  }

  // 文章详情  /article/detail/:id
  static async detail (ctx) {
    const article = await Article.findById(ctx.params.id).populate({ path: 'author'})
    if(!article){
      ctx.body = {
        status: 0,
        msg: '文章不存在！'
      }
      return
    }
    // 文章每请求一次，阅读量加1
    article.viewsCount = article.viewsCount + 1
    article.save()

    ctx.body = {
      status: 1,
      msg: '文章获取成功！',
      data: article
    }
  }

  // 发布文章 /article/add  body token
  static async add (ctx) {
    const article = await Article.create(ctx.request.body)

    ctx.body = {
      status: 1,
      msg: '文章添加成功！',
      data: article
    }
    // 发布文章日志
    await Log.create({
      type: 'add',
      entry: {
        uid: article._id,
        title: article.title,
        author: article.author,
        url: `http://localhost:8080/info/post/${article._id}`
      },
      user: ctx.state.user._id
    })
  }

  // 更新文章 /article/update  body token
  static async update (ctx) {
    const article = await Article.findOne({_id: ctx.request.body._id})
    if(!article){
      ctx.body = {
        status: 0,
        msg: '文章不存在！',
        params: ctx.request.body._id,
        data: article
      }
      return
    }
    Article.update({_id: ctx.request.body._id}, {$set: ctx.request.body}).exec()
    ctx.body = {
      status: 1,
      msg: '文章更新成功！'
    }
    // 更新文章日志
    await Log.create({
      type: 'update',
      entry: {
        uid: article._id,
        title: article.title,
        author: article.author,
        url: `http://localhost:8080/info/post/${article._id}`
      },
      user: ctx.state.user._id
    })
  }


  // 删除文章 /article/delete/id  token
  static async delete (ctx) {
    const article = await Article.deleteOne({_id: ctx.params.id})
    ctx.body = {
      status: 1,
      msg: '文章删除成功！',
      data: article
    }
  }

  //喜欢文章 /article/like/id   token 
  static async like (ctx) {
    const article = await Article.findById(ctx.params.id)

    if(ctx.request.method === 'PUT'){
      // 文章被喜欢字段+1
      article.collectionCount = article.collectionCount + 1
      article.save()
      // 用户喜欢文章日志
      await Log.create({
        type: 'collection',
        entry: {
          uid: article._id,
          title: article.title,
          author: article.author,
          url: `http://localhost:8080/info/post/${article._id}`
        },
        user: ctx.state.user._id
      })
    } else if(ctx.request.method === 'DELETE'){
      // 文章被喜欢字段-1
      article.collectionCount = article.collectionCount > 0 ? article.collectionCount - 1 : 0
      article.save()
      // 删除对应日志
      await Log.deleteOne({
        'entry.uid': article._id,
        user: ctx.state.user._id,
        type: 'collection'
      })
    }
    ctx.body = {
      status: 1,
      msg: 'ok'
    }
  }
}

module.exports = ArticleController
