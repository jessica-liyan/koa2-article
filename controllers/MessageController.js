const Message = require('../model/message')
const Group = require('../model/group')

class MessageController {
  // 获取历史消息列表 /message/list   {from to type}  token
  static async  messageList(ctx) {
    let msg
    if(ctx.request.body.type === 'text'){
      msg = await Message.find({
        $or: [
          {to: ctx.request.body.to, from: ctx.request.body.from},
          {from: ctx.request.body.to, to: ctx.request.body.from}
        ]
      }).populate({ path: 'to', select: 'name avatar'}).populate({ path: 'from', select: 'name avatar'})
    } else {
      msg = await Message.find({
        to: ctx.request.body.to
      }).populate({ path: 'from', select: 'name avatar'})
    }  
    ctx.body = {
      status: 1,
      msg: 'ok！',
      data: msg
    }
  }

  // 获取当前用户的聊天好友列表 /message/:id  token
  static async friends(ctx){
    const msg = await Message.find({to: ctx.params.id}, 'from').populate({ path: 'from', select: 'name avatar'})

    var friends = [];
    msg.forEach(function(item){
      friends.includes(item) ? '' : friends.push(item);
    })

    ctx.body = {
      status: 1,
      msg: 'ok！',
      data: friends
    }
  }

  // 所有群组列表 /group
  static async groupList (ctx) {
    const groups = await Group.find().populate({ path: 'creator', select: 'name avatar'}).populate({ path: 'members', select: 'name avatar online'})
    ctx.body = {
      status: 1,
      msg: '群组列表获取成功！',
      data: groups
    }
  }

  // 创建群组 /group/add  {name, creator, members}
  static async createGroup (ctx) {
    const group = await Group.create(ctx.request.body)
    ctx.body = {
      status: 1,
      msg: '创建群组成功！',
      data: group
    }
  }

  // 群组信息 /group/:id
  static async groupInfo (ctx) {
    const group = await Group.findById(ctx.params.id).populate({ path: 'creator', select: 'name avatar'}).populate({ path: 'members', select: 'name avatar online'})
    ctx.body = {
      status: 1,
      msg: '获取群组信息成功！',
      data: group
    }
  }

  // 申请加群 /group/join/:id    token
  static async joinGroup (ctx) {
    const group = await Group.findById(ctx.params.id)
    if(!group){
      ctx.body = {
        status: 0,
        msg: '群组不存在！'
      }
      return
    }
    if(group.members.find(item => item === ctx.state.user._id)){
      ctx.body = {
        status: 0,
        msg: '您已经是该群成员，不能重复添加！'
      }
      return
    }
    group.members.push(ctx.state.user._id)
    group.save()

    ctx.body = {
      status: 1,
      msg: '申请加群成功！',
      data: group
    }
  }

  // 退群  /group/leave/:id    token
  static async leaveGroup (ctx) {
    const group = await Group.findById(ctx.params.id)
    if(!group){
      ctx.body = {
        status: 0,
        msg: '群组不存在！'
      }
      return
    }
    const index = group.members.findIndex(item => item == ctx.state.user._id)
    if(index === -1){
      ctx.body = {
        status: 0,
        msg: '您已经不是该群成员！'
      }
      return
    }
    group.members.splice(index, 1)
    group.save()

    ctx.body = {
      status: 1,
      msg: '退群成功！',
      data: group
    }
  }
}

module.exports = MessageController