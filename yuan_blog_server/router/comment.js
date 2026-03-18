const Router = require("@koa/router");
const jwtAuth = require("koa-jwt")
const CommentController = require("../controller/CommentController")
const config = require("../config/index.js")

const router = new Router();

router.prefix("/comment")
//  jwtAuth({ secret: config.security.secretKey }) 添加验证中间件
// 添加评论
router.post("/", jwtAuth({ secret: config.security.secretKey }), CommentController.createComment)
// 获取所有评论
router.get("/", CommentController.getCommentList)
// 获取评论详情
router.get("/:_id", CommentController.getCommentDetail)
// 更新评论
router.put("/:_id", jwtAuth({ secret: config.security.secretKey }), CommentController.updateComment)

// 删除评论
router.delete("/:_id", jwtAuth({ secret: config.security.secretKey }), CommentController.deleteComment)


module.exports = router; 