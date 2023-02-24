import request from '@/libs/request';
// import request from '@/libs/userRequest';

export const onLogin = (data) => request<any>({
  method: 'POST',
  url: '/admin/login',
  data
});
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

export const Logout = () => request<any>({method: 'get', url: '/api/logout'});
