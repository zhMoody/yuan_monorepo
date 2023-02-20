const Router = require("@koa/router");
const jwtAuth = require("koa-jwt")
const AdminController = require("../controller/AdminController")
const config = require("../config/index.js")

const router = new Router();

router.prefix("/admin")

// 注册
router.post("/register", AdminController.register)

// 登录 
router.post("/login", AdminController.login)

// 获取用户
router.get("/user/info", jwtAuth({ secret: config.security.secretKey }), AdminController.getUserInfo)
// 更新用户信息
router.put("/user/info", jwtAuth({ secret: config.security.secretKey }), AdminController.uodateUserInfo)
// auth 验证
router.post('/auth', jwtAuth({ secret: config.security.secretKey }), AdminController.userAuth)
module.exports = router;