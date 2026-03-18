const { commentValidator } = require('../validators/comment')
const CommentModel = require('../models/CommentModel')
const ReplyModel = require('../models/ReplyModel')

const res = require('../core/helper')
class CommentController {
  // 新增评论
  static async createComment(ctx, next) {
    commentValidator(ctx)
    // const { nickname, content, target_id } = ctx.request.body
    const data = await CommentModel.create(ctx.request.body)
    ctx.body = res.json(data)
  }
  //  获取所有评论
  static async getCommentList(ctx, next) {
    let { pagenum = 1, pagesize = 5 } = ctx.query
    let tootal = await CommentModel.find().countDocuments()

    let commentList = await CommentModel.find({}, { __v: 0 },
      {
        skip: (+pagenum - 1) * +pagesize,
        limit: +pagesize,
        _id: -1
      })
    ctx.body = res.json({ result: commentList, pagenum, pagesize, tootal })
  }
  // 获取评论详情
  static async getCommentDetail(ctx, next) {
    let { _id } = ctx.params

    let commentDetail = await CommentModel.findById({ _id }, { __v: 0 })
    if (!commentDetail) throw new global.errs.NotFound('没有找到相关评论')
    const replyList = await ReplyModel.find({ comment_id: _id }, { __v: 0 }, { limit: 10 })
    ctx.body = res.json({ commentDetail, replyList })
  }

  // 更新评论
  static async updateComment(ctx, next) {
    commentValidator(ctx)
    let _id = ctx.params._id
    let updateComment = await CommentModel.findByIdAndUpdate({ _id }, ctx.request.body)
    if (!updateComment) throw new global.errs.NotFound('没有找到相关评论')
    ctx.body = res.json('更新评论成功')
  }

  // 删除评论
  static async deleteComment(ctx, next) {
    let _id = ctx.params._id
    let deleteComment = await CommentModel.findByIdAndDelete({ _id })
    if (!deleteComment) throw new global.errs.NotFound('没有找到相关评论')
    ctx.body = res.json('删除评论成功')
  }
}

module.exports = CommentController