const ArticleModel = require('../models/ArticleModel');
const CategoryModel = require('../models/CategoryModel');
const CommentModel = require('../models/CommentModel');
const res = require('../core/helper');

class OverviewController {
  // 获取后台管理概览统计
  static async getOverview(ctx, next) {
    // 同时统计多项数据
    const [articleCount, categoryCount, commentCount] = await Promise.all([
      ArticleModel.countDocuments(),
      CategoryModel.countDocuments(),
      CommentModel.countDocuments()
    ]);

    ctx.body = res.json({
      articleCount,
      categoryCount,
      commentCount
    });
  }
}

module.exports = OverviewController;
