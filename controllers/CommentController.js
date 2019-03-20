const Comment = require('../model/comment')
const Article = require('../model/article')
const Log = require('../model/log')

class CommentController {
  // 发表评论  /comment  {文章id(targetId) parentId content}  token
  static async comment (ctx) {
    const article = await Article.findById(ctx.request.body.targetId)

    const comment = await Comment.create({
      targetId: ctx.request.body.targetId,
      content: ctx.request.body.content,
      parentId: ctx.request.body.parentId,
      user: ctx.state.user._id, // 评论人
    })
    // article表的评论统计数加1
    article.commentsCount = article.commentsCount + 1
    article.save()

    await Log.create({
      type: 'comment',
      entry: {
        uid: article._id,
        title: article.title,
        author: article.author,
        url: `http://localhost:8080/info/post/${article._id}`
      },
      comment: comment,
      user: ctx.state.user._id
    })

    ctx.body = {
      status: 1,
      msg: 'success',
      data: comment
    }
  }

  // 获取评论列表 /comment/:id 
  static async fetch (ctx) {
    const comments = await Comment.find({targetId: ctx.params.id}).populate({ path: 'user'}).sort({created_at: -1})
    ctx.body = {
      status: 1,
      msg: 'success',
      data: getTrees(comments, '')
    }
  }
}

module.exports = CommentController

function getTrees(list, parentId) {
  let items = {};
  for (let i = 0; i < list.length; i++) {
      let key = list[i].parentId;
      if (items[key]) {
          items[key].push(list[i]);
      } else {
          items[key] = [];
          items[key].push(list[i]);
      }
  } 
  return formatTree(items, parentId);
}

function formatTree(items, parentId) {
  let result = [];
  if (!items[parentId]) {
      return result;
  }
  for (let t of items[parentId]) {
      t.children = formatTree(items, t._id)
      result.push(t);
  }
  return result;
}
