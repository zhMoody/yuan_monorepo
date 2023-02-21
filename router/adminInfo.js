const Router = require("@koa/router");
const jwtAuth = require("koa-jwt")
const AdminInfoController = require("../controller/AdminInfoController")
const config = require("../config/index.js")

const router = new Router();

router.prefix("/adminInfo")

// 获取用户信息
router.get("/", AdminInfoController.getAdminInfo)
// 获取用户
// router.get("/", jwtAuth({ secret: config.security.secretKey }), AdminInfoController.getUserInfo)

// 更新用户信息
router.put("/:id", jwtAuth({ secret: config.security.secretKey }), AdminInfoController.updateAdminInfo)

module.exports = router;