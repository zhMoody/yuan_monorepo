import request from "@/libs/request";

/**
 * 文章列表 // http://localhost:3000/article
 * data {pagesize:number, pagenum:number}
 */
export const getArticleList = (data): Promise<Article.RootObject> => request({
  method: 'GET',
  url: `/article?pagesize=${data.pagesize}&pagenum=${data.pagenum}`,
})
//获取右边推荐位文章列表
export const getSpecify = (): Promise<Specify.RootObject> => request({
  url: `/article/specify`,
  method: 'POST'
})

// 获取文章详情
export const getArticleDetail = (params): Promise<ArcirleDetail.RootObject> => request({
  method: 'GET',
  url: `/article/${params}`,
})
// 删除文章
export const delArticle = (params): Promise<DeleteArticle.RootObject> => request({
  url: `/article/${params}`,
  method: 'delete'
})
// 更新文章
export const updateArticle = (params, data): Promise<DeleteArticle.RootObject> => request({
  url: `/article/${params}`,
  method: 'put',
  data
})

/**
 * 添加文章
 * @param data
 * */
export const addArticle = (data): Promise<DeleteArticle.RootObject> => request({
  url: `/article`,
  method: 'post',
  data
})

// 获取所有分类
export const getCategroy = (): Promise<CategroyData.RootObject> => request({
  url: `/categroy`,
  method: 'get'
})

// 删除分类
export const deleteCategroy = (params): Promise<DeleteArticle.RootObject> => request({
  url: `/categroy/${params}`,
  method: 'delete'
})
//创建分类
export const addCategroy = (data): Promise<DeleteArticle.RootObject> => request({
  url: `/categroy`,
  method: 'post',
  data
})
// 更新分类信息
export const updateCategroy = (params, data): Promise<DeleteArticle.RootObject> => request({
  url: `/categroy/${params}`,
  method: 'put',
  data
})
// 获取分类下的文章
export const getCategroyItem = (params): Promise<ArcirleDetail.RootObject> => request({
  url: `/categroy/${params}`,
  method: 'get'
})
