const axios = require('axios')
const res = require('../core/helper')
class MusicController {
  static async getMusic(ctx, next) {

    let musicData = await axios.get("https://coder.cm/index.php/action/handsome-meting-api?server=netease&type=playlist&id=159016326&auth=97e9c422c7dc199d517dcd6cf9f833fa&r=0.705131969872477")
    console.log('res.data',);
    ctx.body = res.json(musicData.data)
  }
}

module.exports = MusicController
