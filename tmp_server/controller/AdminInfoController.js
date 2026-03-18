const AdminInfoModel = require('../models/AdminInfoModel')
const ArticleModel = require('../models/ArticleModel')
const res = require('../core/helper')
class AdminInfoController {
  // 获取用户配置信息
  static async getAdminInfo(ctx, next) {
    let admin_id = ctx.query.id
    const adminInfo = await AdminInfoModel.findOne({}, { admin_id: 0, __v: 0 })
    const onFile = await ArticleModel.find({}, { content: 0, browse: 0, category_id: 0, cover: 0, description: 0, keyword: 0, updated: 0 }).sort({ created: -1 })
    
    if (!adminInfo) {
      // 只有在 admin_id 存在且不是 "undefined" 时才创建，否则报错
      if (!admin_id || admin_id === 'undefined') {
        throw new global.errs.ParameterException('admin_id 参数错误或未登录')
      }
      await AdminInfoModel.create({ admin_id })
      throw new global.errs.NotFound('没有找到用户配置,已重新创建')
    }
    ctx.body = res.json({ result: adminInfo, onfile: onFile })
  }

  // 获取用户信息处理
  // 更新文章
  static async updateAdminInfo(ctx, next) {
    let admin_id = ctx.params.id
    const updatedAdminInfo = await AdminInfoModel.findOneAndUpdate({ admin_id }, ctx.request.body)
    if (!updatedAdminInfo) {
      throw new global.errs.NotFound('没有找到用户的个人配置')
    }
    ctx.body = res.json('更新个人配置成功')
  }
}

module.exports = AdminInfoController