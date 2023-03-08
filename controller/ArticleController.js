const { articleValidator } = require('../validators/article')
const ArticleModel = require('../models/ArticleModel')
const CommentModel = require('../models/CommentModel')
const ReplyModel = require('../models/ReplyModel')
const axios = require('axios')
const res = require('../core/helper')
const config = require('../config/index')
class ArticleController {
  // 创建文章成功
  static async create(ctx, next) {
    articleValidator(ctx)
    const { title } = ctx.request.body
    const hasAritcle = await ArticleModel.findOne({ title })
    if (hasAritcle) {
      throw new global.errs.Existing('文章标题已存在，换一个标题试试吧！')
    }
    await ArticleModel.create(ctx.request.body)
    ctx.body = res.json('创建文章成功')
  }

  // 获取文章列表

  static async getArticleList(ctx, next) {
    let { pagenum = 1, pagesize = 10, keyword, category_id = null } = ctx.query
    let tootal = await ArticleModel.find().countDocuments()
    let filter = {}
    if (category_id) {
      filter = { category_id }
    }
    let categorylList = await ArticleModel.find(filter, { __v: 0, content: 0 },
      {
        skip: (+pagenum - 1) * +pagesize,
        limit: +pagesize,
        or: [{
          // 模糊查询
          keyword: {
            $regex: new RegExp(keyword, 'i')
          }
        }],
        populate: 'category_id'  // 链表查询
      }).sort({ _id: -1 })
    ctx.body = res.json({ result: categorylList, pagenum, pagesize, tootal })
  }
  // 更新文章
  static async updateArticle(ctx, next) {
    console.log(' ctx.request.body :>> ', ctx.request.body);
    let _id = ctx.params._id
    const updatedArticle = await ArticleModel.findByIdAndUpdate({ _id }, ctx.request.body)
    if (!updatedArticle) throw new global.errs.NotFound('没有找到相关文章')
    ctx.body = res.json('更新成功')
  }

  //根据id获取文章详情
  static async getArticleDetailById(ctx, next) {
    let _id = ctx.params._id
    const articleDetail = await ArticleModel.findById({ _id }, { __v: 0 }, {
      populate: 'category_id'  // 链表查询
    })
    if (!articleDetail) throw new global.errs.NotFound('没有找到相关文章')
    await ArticleModel.findByIdAndUpdate({ _id }, { browse: ++articleDetail.browse })
    const commentList = await CommentModel.find({ target_id: _id }, { __v: 0 }, { limit: 10 }).sort({ _id: -1, })
    ctx.body = res.json({
      articleDetail,
      commentList
    })
  }

  //删除文章
  static async deleteArticleById(ctx, next) {
    let _id = ctx.params._id
    const deleteArticle = await ArticleModel.findByIdAndDelete({ _id })
    if (!deleteArticle) throw new global.errs.NotFound('没有找到相关文章')
    ctx.body = res.json('删除成功')
  }

  //文章封面上传
  static async uploadCoverImg(ctx, next) {
    const _id = ctx.params._id
    let filepath = ctx.req.file.destination.replace(/^public\//, '') + ctx.req.file.filename
    let imagePath = config.host + ':' + config.port + '/' + filepath
    await ArticleModel.findByIdAndUpdate({ _id }, { cover: imagePath })
    ctx.body = res.json({
      filePath: imagePath
    })
  }

  // 获取指定文章
  static async getSpecifyArticleList(ctx, next) {
    function getRandomArrayElements(arr, count) {
      var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
      while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
      }
      return shuffled.slice(min);
    }
    let newArticleList = await ArticleModel.find({}, { __v: 0, content: 0 },
      {
        limit: 5,
        populate: 'category_id'
      }).sort({ _id: -1 })
    let mostViewedList = await ArticleModel.find({}, { __v: 0, content: 0 },
      {
        limit: 5,
        populate: 'category_id'
      }).sort({ browse: -1 })
    let randomdViewList = await ArticleModel.find({}, { __v: 0, content: 0 }, { populate: 'category_id' }).sort({ browse: -1 })
    let randomdList = getRandomArrayElements(randomdViewList, 5)
    ctx.body = res.json({ newArticleList, mostViewedList, randomdList })
  }
}

module.exports = ArticleController