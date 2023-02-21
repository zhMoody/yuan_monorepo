const { categoryValidator } = require('../validators/category')
const CategoryModel = require('../models/CategoryModel')
const ArticleModel = require('../models/ArticleModel')

const res = require('../core/helper')
class CategoryController {
  // 创建分类
  static async create(ctx, next) {
    categoryValidator(ctx)
    const { name, keyword } = ctx.request.body
    const hasCategory = await CategoryModel.findOne({ name })
    if (hasCategory) {
      throw new global.errs.Existing('分类名已存在')
    }
    await CategoryModel.create({
      name, keyword
    })
    ctx.body = res.json('创建分类成功')
  }

  // 获取所有分类
  static async getAllCategroy(ctx, next) {
    // let tootal = await CategoryModel.find().countDocuments()
    let categorylList = await CategoryModel.find({}, { __v: 0 })
    if (!categorylList) throw new global.errs.NotFound('没有找到所有分类')
    ctx.body = res.json({ result: categorylList })
  }

  // 更新分类
  static async updateCategroy(ctx, next) {
    const { name, keyword } = ctx.request.body
    categoryValidator(ctx)
    let _id = ctx.params._id
    let category = await CategoryModel.findByIdAndUpdate({ _id }, { name, keyword })
    if (!category) {
      throw new global.errs.NotFound('没有找到要更新的分类')
    }
    ctx.body = res.json('更新成功')
  }

  //删除分类
  static async deleteCategroy(ctx, next) {
    let _id = ctx.params._id
    let category = await CategoryModel.findByIdAndDelete({ _id })
    if (!category) {
      throw new global.errs.NotFound('没有找到要删除的分类')
    }
    ctx.body = res.json('删除成功')
  }

  //查找该分类下的所有文章
  static async AllCategroy(ctx, next) {
    let category_id = ctx.params._id
    let category = await ArticleModel.find({ category_id })
    if (!category) {
      throw new global.errs.NotFound('没有找到要删除的分类')
    }
    ctx.body = res.json(category)
  }
}

module.exports = CategoryController