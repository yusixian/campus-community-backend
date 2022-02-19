/*
 * @Author: cos
 * @Date: 2022-02-18 14:15:27
 * @LastEditTime: 2022-02-18 15:03:29
 * @LastEditors: cos
 * @Description: 文章相关控制器
 * @FilePath: \campus-community-backend\src\controller\article.controller.js
 */
const { createArticle } = require('../service/article.service')
const { articleCreateErr } = require('../constant/err.type')

class ArticleController {
    async postArticle(ctx, next) {
        console.log(ctx.request.body);
        const { user_id, title, content, summary } = ctx.request.body;
        console.log(user_id, content, summary)
        try {
            const res = await createArticle(user_id, title, content, summary)
            ctx.body = {
                code: 0,
                message: "发帖成功！",
                result: {
                    id: res.id,
                    title: res.title
                }
            }
        } catch (err) {
            console.log(err);
            ctx.app.emit('error', articleCreateErr, ctx)
        }
    }
}

module.exports = new ArticleController()