const bcrypt = require('bcryptjs')

// 生成hash密码

exports.encryption = function (password) {
  // 生成随机数
  let salt = bcrypt.genSaltSync(12)
  // 生成hash密码
  return bcrypt.hashSync(password, salt);
}
// 解码
exports.verification = function (e, hash) {
  console.log('e && hash :>> ', e, hash);
  return bcrypt.compareSync(e, hash);
}
