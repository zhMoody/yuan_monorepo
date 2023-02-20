const AdminModel = require("../models/AdminModel")
const { generateToken } = require("../core/util.js")
const bcrypt = require('../core/bcrypt')
class LoginManager {
  static async adminLogin(nickname, password) {
    // 查找数据库中是否有此用户名和密码
    const user = await AdminModel.findOne({ nickname });
    if (!user) {
      throw new global.errs.AuthFailed("用户名不存在哦～")
    }
    // 对比两次密码是否一致
    let correct = bcrypt.verification(password, user.password);
    if (!correct) throw new global.errs.AuthFailed("密码不正确哦～")
    // 用户名存在，密码正确
    let token = generateToken(user._id);

    return {
      nickname: user.nickname,
      token
    }
  }
}

module.exports = LoginManager;