const Router = require("@koa/router");
const jwtAuth = require("koa-jwt")
const CategroyController = require("../controller/CategoryController")
const config = require("../config/index.js")

const router = new Router();

// 创建分类
router.post("/categroy", jwtAuth({ secret: config.security.secretKey }), CategroyController.create)

// 获取所有分类
router.get("/categroy", CategroyController.getAllCategroy)

// 更新分类
router.put("/categroy/:_id", CategroyController.updateCategroy)

// 删除分类
router.delete("/categroy/:_id", jwtAuth({ secret: config.security.secretKey }), CategroyController.deleteCategroy)

// 获取该分类下所有文章
router.get("/categroy/:_id", CategroyController.AllCategroy)

module.exports = router;