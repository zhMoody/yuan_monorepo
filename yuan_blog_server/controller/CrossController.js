const res = require('../core/helper')
const CrossModel = require('../models/CrossModel')
class CrossController {
    static async getCrossData(ctx, next) {
        const crossData = await CrossModel.find({}, { __v: 0 }).sort({ createAt: -1 })
        ctx.body = res.json(crossData)
    }
    static async addCrossData(ctx, next) {
        console.log('ctx.request.body :>> ', ctx.request.body);
        await CrossModel.create(ctx.request.body) // 创建动态
        ctx.body = res.json('发布动态成功')
    }

    static async deleteCrossData(ctx, next) {
        let _id = ctx.params._id
        const deleteCross = await CrossModel.findByIdAndDelete({ _id })
        if (!deleteCross) throw new global.errs.NotFound('没有找到相关动态')
        ctx.body = res.json('删除成功')
    }
}

module.exports = CrossController