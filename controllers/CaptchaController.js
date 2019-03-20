const svgcaptcha = require('svg-captcha');

class CaptchaController {
  static async fetch (ctx) {
    const captcha = svgcaptcha.create()
    ctx.body = captcha.data
    ctx.session.captcha = captcha.text
    console.log(ctx.session)
  }
}

module.exports = CaptchaController
