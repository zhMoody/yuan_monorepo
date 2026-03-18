import request from '@/libs/request';
import { encrypt } from '@/libs/utils/crypto';

export const onLogin = async (data) => {
  // 创建副本，避免修改原始响应式对象导致 UI 上的输入框内容变化
  const requestData = { ...data };

  if (requestData.password) {
    const encrypted = await encrypt(requestData.password);
    if (encrypted) {
      requestData.password = encrypted;
    }
  }
  return request<any>({
    method: 'POST',
    url: '/admin/login',
    data: requestData
  });
};
// 获取登录角色info
export const getUserInfo = () => request<any>({
  method: 'GET',
  url: '/admin/user/info',
});
// 获取个人配置
export const getConfigInfo = (params?: any): Promise<ConfigInfo.RootObject> => request({
  method: 'GET',
  url: `/adminInfo?id=${params}`,

});
// 更新个人配置
export const updateConfigInfo = (params, data) => request<any>({
  method: 'PUT',
  url: `/adminInfo/${params}`,
  data
});
// 验证信息登录后台
export const auth = (data) => request<any>({
  url: "admin/auth",
  method: 'POST',
  data
})
// 获取后台数据
export const getMonitorData = () => request({
  url: "admin/overview",
  method: 'GET',
})
// 获取系统信息
export const getSysInfo = () => request<any>({
  url: "admin/monitor",
  method: 'GET',
})
export const Logout = () => request<any>({method: 'get', url: '/api/logout'});
