// 1.引入mongoose
const mongoose = require('mongoose')
const moment = require('moment')

// 2.字义Schema(描述文档结构)
const CrossSchema = new mongoose.Schema({
    nickname: { type: String, require: true },// 发布动态的人
    content: { type: String, require: true }, // 动态内容
    createAt: {
        type: Date,
        require: true,
        default: Date.now,
        // 处理时间 
        get(val) {
            return moment(val).format('YYYY-MM-DD HH:mm:ss')
        }
    },
    formAddr: {
        type: 'string',
        require: true,
        default: 'Chrome'
    }
})
//只有将Schema设置如下配置，才能调用get方法
CrossSchema.set('toJSON', { getters: true });
// 3.定义Model(与集合对应,可以操作集合)
const CrossModel = mongoose.model('Cross', CrossSchema, 'cross');

// 4.向外暴露model
module.exports = CrossModel;