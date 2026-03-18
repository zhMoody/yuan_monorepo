import {defineStore} from 'pinia';
import storage from 'store';
import {useRouter} from 'vue-router';
import UaParser, {IResult as UaResult} from 'ua-parser-js';
import {getUserInfo, onLogin} from '@/api/index'
import config from '../../config/index'

const router = useRouter()

export interface UserState {
  userInfo: UserInfo;
  ua: UaResult;
}

export interface UserInfo {
  id: string;
  token: string;
}

const defaultUserInfo = {
  id: '',
  token: '',
};

export const useUserStore = defineStore({
  id: 'PageExample',
  state: (): UserState => ({
    userInfo: storage.get('USER_INFO'),
    ua: new UaParser().getResult(),
  }),
  actions: {
    resetUserInfo() {
      this.userInfo = {...defaultUserInfo, ...config};
    },
    async getUserInfo() {
      // 异步调用查询用户信息接口
      try {
        const userinfo = await getUserInfo()
        this.userInfo = {...this.userInfo, ...userinfo.data}
        storage.set('USER_INFO', userinfo.data);
      } catch (err) {
        console.log('err', err)
      }
    },
    async login(payload) {
      // 调用登陆接口
      let data = payload
      try {
        const res = await onLogin(data)
        this.userInfo = {...this.userInfo, token: res.data.token}
        storage.set('ACCESS_TOKEN', res.data.token);
        this.getUserInfo()
      } catch (err) {
        console.log(err)
      }
    },
    async logout() {
      // 调用退出登陆接口
      storage.remove('ACCESS_TOKEN')
      storage.remove('USER_INFO')
      this.resetUserInfo();
    },
    async verification(token: string) {
      // 调用 token 验证接口

      return Promise.resolve(token);
    },
  },
});
