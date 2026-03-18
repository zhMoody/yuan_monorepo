const Router = require("@koa/router");
const jwtAuth = require("koa-jwt")
const ReplyController = require("../controller/ReplyController")
const config = require("../config/index.js")

const router = new Router();

router.prefix("/reply")

// 添加回复
router.post("/", jwtAuth({ secret: config.security.secretKey }), ReplyController.createReply)
// 获取所有回复
router.get("/", ReplyController.getReplyList)
// 获取所有回复详情
router.get("/:_id", ReplyController.getReplyDetail)
// 更新回复
router.put("/:_id", ReplyController.updateReply)
// 删除回复
router.delete("/:_id", ReplyController.deleteReply)

module.exports = router;