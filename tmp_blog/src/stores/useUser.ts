import {getConfigInfo, getUserInfo, onLogin} from "@/api";
import {defineStore} from 'pinia';
import storage from "store";
import {nextTick, ref} from "vue";
import config from '../../config/index';

export interface UserInfo {
  id?: string;
  token?: string;
  nickname?: string;
  avatar?: string;
  _id?: string,
  userIntro: string,
  userName: string,
  baseAvatarUrl: string,
  onfile?: Array<ConfigInfo.Onfile>
}

const defaultUserInfo = {
  id: '',
  token: '',
  avatar: '',
  _id: '',
  ...config,
  onfile: []
};
export default defineStore('useUserStore', () => {
  const userInfo = ref<UserInfo>(defaultUserInfo)
  const login = async (payload) => {
    try {
      let data = payload
      const res = await onLogin(data)
      userInfo.value.token = res.data.token
      const userinfo = await getUserInfo()
      userInfo.value = {...userInfo.value, id: userinfo.data._id, ...userinfo.data}
      delete userInfo.value._id
    } catch (err: any) {
      throw err
    }
  }

  const getUserConfigInfo = async () => {
    try {
      const res = await getConfigInfo()
      if (res && res.data && res.data.result) {
        // @ts-ignore
        delete res.data.result._id
        // @ts-ignore
        delete res.data.result.id
        userInfo.value = {...(userInfo.value || {}), ...res.data.result}
        userInfo.value.onfile = res.data.onfile
      }
    } catch (err) {
      console.error('获取配置信息失败', err)
    }
  }

  const logout = () => {
    nextTick(() => {
      userInfo.value = {...config}
      storage.remove('useUserStore')
    })
  }

  return {userInfo, login, logout, getUserConfigInfo}
}, {
  persist: true
})
