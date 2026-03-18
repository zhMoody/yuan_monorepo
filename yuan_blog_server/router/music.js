const Router = require("@koa/router");
const MusicController = require("../controller/MusicController")
const router = new Router();

router.prefix("/music")
// 获取音乐
router.get("/", MusicController.getMusic)

module.exports = router; 