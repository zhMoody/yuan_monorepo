const { replyValidator } = require('../validators/reply')
const ReplyModel = require('../models/ReplyModel')
const CommentModel = require('../models/CommentModel')
const res = require('../core/helper')
class ReplyController {
  // 添加回复
  static async createReply(ctx, next) {
    replyValidator(ctx)
    const { comment_id } = ctx.request.body
    let comment = await CommentModel.findById({ _id: comment_id })
    if (!comment) throw global.errs.NotFound('没有找到相关评论')
    let reply = await ReplyModel.create(ctx.request.body)
    ctx.body = res.json(reply)
  }
  // 获取所有回复
  static async getReplyList(ctx, next) {
    const { comment_id } = ctx.query
    let replyList = null
    if (comment_id) {
      replyList = await ReplyModel.find({ comment_id })
    } else {
      replyList = await ReplyModel.find().sort({ _id: -1 })
    }
    ctx.body = res.json(replyList)
  }

  // 获取单条回复详情
  static async getReplyDetail(ctx, next) {
    let _id = ctx.params._id
    let replyDetail = await ReplyModel.findById({ _id })
    if (!replyDetail) throw new global.errs.NotFound('没有找到相关回复')
    ctx.body = res.json(replyDetail)
  }

  // 修改单条回复
  static async updateReply(ctx, next) {
    let _id = ctx.params._id
    let reply = await ReplyModel.findByIdAndUpdate({ _id }, ctx.request.body)
    if (!reply) throw new global.errs.NotFound('没有找到相关回复')
    ctx.body = res.success('修改回复成功')
  }

  // 删除单条回复
  static async deleteReply(ctx, next) {
    let _id = ctx.params._id
    let reply = await ReplyModel.findByIdAndDelete({ _id })
    if (!reply) throw new global.errs.NotFound('没有找到相关回复')
    ctx.body = res.success('删除成功')
  }
}

module.exports = ReplyController