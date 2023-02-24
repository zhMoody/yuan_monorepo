// 1.引入mongoose
const mongoose = require('mongoose')
const moment = require('moment')

// 2.字义Schema(描述文档结构)
const AdminInfoSchema = new mongoose.Schema({
  userName: { type: String, default: 'Yuan' },//评论人昵称
  createAt: {
    type: Date,
    require: true,
    default: Date.now,
    // 处理时间
    get(val) {
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  baseAvatarUrl: {
    require: true,
    type: String,
    default: 'https://q1.qlogo.cn/g?b=qq&nk=2693131889&s=100'
  },
  userIntro: {
    require: true,
    type: String,
    default: '从此烟雨落青城 一人撑伞两人行。'
  },
  leftFooter: {
    require: true,
    type: String,
    default: 'Moody'
  },
  rightFooter: {
    require: true,
    type: String,
    default: 'Yuan'
  },
  homeTitle: {
    require: true,
    type: String,
    default: '- Yuan -'
  },
  homeIntro: {
    require: true,
    type: String,
    default: '&(￣︶￣)↗[GO!][]~(￣▽￣)~*'
  },
  onFilebg: {
    require: true,
    type: String,
    default: 'https://s1.ax1x.com/2020/07/26/apFekF.jpg'
  },
  admin_id: {
    require: true,
    type: mongoose.Schema.Types.ObjectId,
    // 引用
    ref: 'Admin'
  }
})
//只有将Schema设置如下配置，才能调用get方法
AdminInfoSchema.set('toJSON', { getters: true });
// 3.定义Model(与集合对应,可以操作集合)
const AdminInfoModel = mongoose.model('AdminInfo', AdminInfoSchema, 'adminInfo');

// 4.向外暴露model
module.exports = AdminInfoModel;