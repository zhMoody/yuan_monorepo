const axios = require('axios')
const res = require('../core/helper')
class MusicController {
  static async getMusic(ctx, next) {

    let musicData = await axios.get("https://hubyo.cn/index.php/action/handsome-meting-api?server=netease&type=playlist&id=159016326&auth=77dfd5839cd695b4aef0f032fa2a02ea&r=0.4271286611798315")
    console.log('res.data',);
    ctx.body = res.json(musicData.data)
  }
}

module.exports = MusicController