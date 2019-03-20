const fs = require('fs')

class UploadController {
  static async upload (ctx) {
    const file = ctx.request.files.file; // 获取上传文件
    const reader = fs.createReadStream(file.path); // 创建可读流
    const ext = file.name.split('.').pop(); // 获取上传文件扩展名
    const filename = `${new Date().Format("yyyyMMdd")}${Math.random().toString(36).substr(2)}.${ext}`;
    const upStream = fs.createWriteStream(`public/images/${filename}`); // 创建可写流
    reader.pipe(upStream); // 可读流通过管道写入可写流
    ctx.body = {
      status: 1,
      msg: '上传成功！',
      data: {
        size: file.size,
        type: file.type,
        ext: ext,
        filename: filename,
        path: `images/${filename}`
      }
    }
  }
}

module.exports = UploadController

Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}