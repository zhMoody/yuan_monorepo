import request from "@/libs/request";

// https://hubyo.cn/index.php/action/handsome-meting-api?server=netease&type=playlist&id=159016326&auth=77dfd5839cd695b4aef0f032fa2a02ea&r=0.4271286611798315
export const getMusicList = () => request<Promise<MusicTypes.RootObject>>({
  url: '/music'
})
