import {defineStore} from 'pinia';
import {ref} from "vue"
import {IResult as UaResult} from "ua-parser-js";
import {getUserInfo, onLogin} from "@/api";
import storage from "store";
import {useRouter} from "vue-router";

export interface UserState {
  userInfo: UserInfo;
  ua: UaResult;
}

export interface UserInfo {
  id: string;
  token: string;
  nickname?: string;
  avatar?: string;
  _id?: string
  userName: string,
  userAvatar: string
}

const defaultUserInfo = {
  id: '',
  token: '',
  nickname: '',
  avatar: '',
  _id: '',
  userName: '烟花春晓',
  userAvatar: 'http://127.0.0.1:3000/images/1675856851053.gif'

};
export default defineStore('useUserStore', () => {
  const userInfo = ref<UserInfo>(defaultUserInfo)
  const login = async (payload) => {
    let data = payload
    const res = await onLogin(data)
    storage.set('ACCESS_TOKEN', res.data.token)
    const userinfo = await getUserInfo()
    userInfo.value = {...userInfo.value, id: userinfo.data._id, token: res.data.token, ...userinfo.data}
    delete userInfo.value._id
  }
  const logout = () => {
    setTimeout(() => {
      storage.remove('useUserStore')
      storage.remove('ACCESS_TOKEN')
      userInfo.value = defaultUserInfo
    }, 10)
  }

  return {userInfo, login, logout}
}, {
  persist: true
})
