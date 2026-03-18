// 处理静态资源链接
export default function baseStaticUrl(src = '') {
  // 如果 src 已经是完整路径（以 http 开头），直接返回
  if (src.startsWith('http')) return src;

  const { VITE_APP_STATIC_URL, MODE } = import.meta.env;
  
  // 如果是生产环境，或者没有配置 VITE_APP_STATIC_URL
  // 并且 src 已经是以 /api 开头的相对路径，则直接使用相对路径
  if (MODE === 'production' || !VITE_APP_STATIC_URL) {
    return src;
  }

  // 开发环境下，拼接后端地址
  return `${VITE_APP_STATIC_URL}${src}`;
}
