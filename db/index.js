const mongoose = require("mongoose");
const config = require("../config");
const AdminModel = require("../models/AdminModel");
const bcrypt = require("../core/bcrypt");

mongoose.connect(`mongodb://${config.db.host}/${config.db.dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  console.log("链接数据库成功");
  
  // 初始化默认管理员账号
  try {
    const adminCount = await AdminModel.countDocuments();
    if (adminCount === 0) {
      const defaultAdmin = {
        nickname: "admin",
        password: bcrypt.encryption("admin")
      };
      await AdminModel.create(defaultAdmin);
      console.log("检测到数据库为空，已自动创建默认管理员账号: admin / admin");
    }
  } catch (err) {
    console.error("初始化管理员账号失败:", err);
  }
});
