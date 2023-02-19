import {defineStore} from 'pinia';
import {nextTick, ref, watch, h} from "vue"
import {getUserInfo, onLogin} from "@/api";
import storage from "store";
import config from '../../config/index'
import {useNotification} from 'naive-ui'

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
    try {
      let data = payload
      const res = await onLogin(data)
      userInfo.value.token = res.data.token
      const userinfo = await getUserInfo()
      userInfo.value = {...userInfo.value, id: userinfo.data._id, ...userinfo.data}
      delete userInfo.value._id
    } catch (err: any) {
      notification.error({
        title: '登录提示',
        content: err,
        duration: 2000
      })
    }
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
