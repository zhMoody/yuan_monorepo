const AdminInfoModel = require('../models/AdminInfoModel')
const AdminModel = require('../models/AdminModel')
const res = require('../core/helper')
const jwt = require('jsonwebtoken');
const config = require('../config/index')
class AdminInfoController {
  // 获取用户配置信息
  static async getAdminInfo(ctx, next) {
    const adminInfo = await AdminInfoModel.findOne({}, { admin_id: 0, __v: 0, createAt: 0 })
    if (!adminInfo) {
      const user = await AdminModel.find({})
      await AdminInfoModel.create({ admin_id: user._id })
      throw new global.errs.NotFound('没有找到用户配置,已重新创建')
    }
    ctx.body = res.json(adminInfo)
  }

  // 获取用户信息处理
  // 更新文章
  static async updateAdminInfo(ctx, next) {
    let admin_id = ctx.params.id
    console.log('ctx.params.admin_id :>> ', ctx.params.id);
    const updatedAdminInfo = await AdminInfoModel.findOneAndUpdate({ admin_id }, ctx.request.body)
    console.log(updatedAdminInfo);
    if (!updatedAdminInfo) {
      throw new global.errs.NotFound('没有找到用户的个人配置')
    }
    ctx.body = res.json('更新个人配置成功')
  }

  // 获取用户信息处理
  static async uodateUserInfo(ctx, next) {

  }
}

module.exports = AdminInfoController