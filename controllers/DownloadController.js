const send = require('koa-send')

class DownloadController {
  // /download/:name  
  static async download (ctx) {
    const name = ctx.params.name
    const file = 'public/images/' + name
    ctx.attachment(file)
    await send(ctx, file)
    ctx.body = {
      path: file
    }
  }
}

module.exports = DownloadController