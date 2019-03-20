
module.exports = {
  db: {
    url: 'mongodb://localhost:27017/api'
  },
  secret: 'swd',
  email: {
    host: 'smtp.qq.com',
    port: 465,
    user: '277948745@qq.com',
    pass: 'oszpgqpqobjgbjjf'
  },
  session: {
    key: 'sessionId', 
    maxAge: 86400000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false
  }
};