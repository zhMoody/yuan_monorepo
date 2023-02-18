import request from "@/libs/request";

/**
 * 文章列表
 * data {pagesize:number, pagenum:number}
 */
export const getArticleList = (data): Promise<Article.RootObject> => request({
  method: 'GET',
  url: `/article?pagesize=${data.pagesize}&pagenum=${data.pagenum}`,
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
// 删除文章
export const updateArticle = (params, data): Promise<DeleteArticle.RootObject> => request({
  url: `/article/${params}`,
  method: 'put',
  data
})

// 删除文章
export const addArticle = (data): Promise<DeleteArticle.RootObject> => request({
  url: `/article`,
  method: 'post',
  data
})

// 获取所有分类
export const getCategroy = (): Promise<CategroyData.ErrRootObject | CategroyData.RootObject> => request({
  url: `/categroy`,
  method: 'get'
})
