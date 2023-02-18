import {defineStore} from 'pinia';
import {nextTick, ref, watch} from "vue"
import {IResult as UaResult} from "ua-parser-js";
import {getUserInfo, onLogin} from "@/api";
import storage from "store";
import {useRouter} from "vue-router";
import config from '../../config/index'
import {useNotification} from 'naive-ui'

export interface UserState {
  userInfo: UserInfo;
  ua: UaResult;
}

export interface UserInfo {
  id?: string;
  token?: string;
  nickname?: string;
  avatar?: string;
  _id?: string,
  userIntro: string,
  userName: string,
  baseAvatarUrl: string
}

const defaultUserInfo = {
  id: '',
  token: '',
  avatar: '',
  _id: '',
  ...config
};
export default defineStore('useUserStore', () => {
  const userInfo = ref<UserInfo>(defaultUserInfo)
  const notification = useNotification()

  const login = async (payload) => {
    let data = payload
    const res = await onLogin(data).catch((error) => {
      notification.error({
        title: '登录提示',
        content: error,
        duration: 2000
      })
    })
    userInfo.value.token = res.data.token
    const userinfo = await getUserInfo()
    userInfo.value = {...userInfo.value, id: userinfo.data._id, ...userinfo.data}
    delete userInfo.value._id
  }

  const logout = () => {
    nextTick(() => {
      userInfo.value = {...config}
      storage.remove('useUserStore')
      storage.remove('ACCESS_TOKEN')
    })
  }

  return {userInfo, login, logout}
}, {
  persist: true
})
