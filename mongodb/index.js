const mongoose =  require('mongoose')
const config = require('../config')

const connect = () => {
   // 连接数据库
  mongoose.connect(config.db.url, {
    useNewUrlParser: true
  })

  // 连接错误
  mongoose.connection.on('error', error => {
    console.log('数据库连接失败!', error)
  })

  // 连接成功
  mongoose.connection.once('open', () => {
    console.log('数据库连接成功!')
  })
}

module.exports = connect