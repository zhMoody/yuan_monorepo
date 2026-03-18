const { registerValidator, loginValidator } = require('../validators/admin')
const LoginManager = require('../services/login')
const AdminModel = require('../models/AdminModel')
const res = require('../core/helper')
const bcrypt = require('../core/bcrypt')
const jwt = require('jsonwebtoken');
const config = require('../config/index')
const AdminInfoModel = require('../models/AdminInfoModel')
const { decrypt } = require('../core/crypto')

class AdminController {
  // 注册处理
  static async register(ctx, next) {
    // 解密密码
    if (ctx.request.body.password) ctx.request.body.password = decrypt(ctx.request.body.password)
    if (ctx.request.body.password2) ctx.request.body.password2 = decrypt(ctx.request.body.password2)

    //验证字段
    registerValidator(ctx)
    let { nickname, password2 } = ctx.request.body

    // 检查数据库中有没有重复用户名
    let currentUser = await AdminModel.findOne({ nickname })
    if (currentUser) {
      throw new global.errs.Existing('用户已存在', 900)
    }
    // 入库
    let user = await AdminModel.create({
      nickname,
      password: bcrypt.encryption(password2)
    })
    let admin_id = user._id
    await AdminInfoModel.create({ admin_id })
    ctx.body = res.json(user)
  }
  // 登录处理 
  static async login(ctx, next) {
    // 解密密码
    if (ctx.request.body.password) {
      ctx.request.body.password = decrypt(ctx.request.body.password)
    }
    
    // 如果有验证逻辑则调用
    // loginValidator(ctx) 

    let { nickname, password } = ctx.request.body
    let user = await LoginManager.adminLogin(nickname, password)
    ctx.body = res.json(user)
  }

  // 获取用户信息处理
  static async getUserInfo(ctx, next) {
    let _id = ctx.state.user.data
    let userInfo = await AdminModel.findById({ _id }, { password: 0, __v: 0 })
    if (!userInfo) {
      throw new global.errs.AuthFailed('用户不存在')
    }
    ctx.body = res.json(userInfo)
  }

  // 获取用户信息处理
  static async uodateUserInfo(ctx, next) {
    let _id = ctx.state.user.data
    let userInfo = await AdminModel.findByIdAndUpdate({ _id })
    if (!userInfo) {
      throw new global.errs.AuthFailed('用户不存在')
    }
    ctx.body = res.json({ _id, nickname: userInfo.nickname })
  }
  // 用户验证
  static async userAuth(ctx, next) {
    let authorization = ctx.header.authorization
    let token = authorization.replace("bearer ", "");
    let _id = ctx.request.body.id
    try {
      let userInfo = await AdminModel.findByIdAndUpdate({ _id })
      let result = jwt.verify(token, config.security.secretKey, {
        complete: userInfo._id
      })
      ctx.body = res.json(result);
    } catch (err) {
      throw new global.errs.AuthFailed('token验证失败，请重新登录！')
    }
  }
}

module.exports = AdminController