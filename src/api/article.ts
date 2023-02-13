import request from "@/libs/request";

/**
 * 文章列表
 *
 * data {pagesize:number, pagenum:number}
 */
export const getArticleList = (data): Promise<Article.RootObject> => request({
  method: 'GET',
  url: `/article?pagesize=${data.pagesize}&pagenum=${data.pagenum}`,
})

export const getArticleDetail = (params): Promise<ArcirleDetail.RootObject> => request({
  method: 'GET',
  url: `/article/${params}`,

})
