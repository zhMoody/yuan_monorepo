// 1.引入mongoose
const mongoose = require("mongoose");
// 2.定义Schema(描述文档结构)
const adminSchema = new mongoose.Schema({
  //⻆⾊名称
  nickname: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
    // 调用了set⽅法，当我们写⼊数据时，bcrypt模块会将存⼊的密码进行哈希密码的加密
  },
  avatar: {
    type: String,
    require: false,
    default: '/api/images/1675856851053.gif'
  }
});
// 3.定义Model(与集合对应,可以操作集合)
const AdminModel = mongoose.model("Admin", adminSchema, 'admin');

// 4.向外暴露
module.exports = AdminModel;
