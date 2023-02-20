const Router = require("@koa/router");
const jwtAuth = require("koa-jwt")
const ArticleController = require("../controller/ArticleController")
const config = require("../config/index.js")
const upload = require('../middlewares/upload')
const router = new Router();

router.prefix("/article")

// 新增文章
router.post("/", jwtAuth({ secret: config.security.secretKey }), ArticleController.create)

// 获取所有文章 
router.get("/", ArticleController.getArticleList)

// 更新文章
router.put("/:_id", jwtAuth({ secret: config.security.secretKey }), ArticleController.updateArticle)

// 获取文章详情
router.get("/:_id", ArticleController.getArticleDetailById)

// 删除文章
router.delete("/:_id", jwtAuth({ secret: config.security.secretKey }), ArticleController.deleteArticleById)

// 文章封面上传
router.post("/upload/:_id", jwtAuth({ secret: config.security.secretKey }), upload.single('avatar'), ArticleController.uploadCoverImg)

// 获取指定文章
router.post("/specify", ArticleController.getSpecifyArticleList)

module.exports = router;