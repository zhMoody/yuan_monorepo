const Router = require("@koa/router");
const jwtAuth = require("koa-jwt")
const CrossController = require("../controller/CrossController")
const config = require("../config/index.js")

const router = new Router();

router.prefix("/cross")

router.get("/", CrossController.getCrossData)
// 更新用户信息
router.post("/addCross", jwtAuth({ secret: config.security.secretKey }), CrossController.addCrossData)
// 删除动态
router.delete("/:_id", jwtAuth({ secret: config.security.secretKey }), CrossController.deleteCrossData)

module.exports = router;