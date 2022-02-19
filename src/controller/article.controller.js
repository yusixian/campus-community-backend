/*
 * @Author: cos
 * @Date: 2022-02-18 14:15:27
 * @LastEditTime: 2022-02-19 16:33:25
 * @LastEditors: cos
 * @Description: 文章相关控制器
 * @FilePath: \campus-community-backend\src\controller\article.controller.js
 */
const { createArticle } = require('../service/article.service')
const { articleCreateErr } = require('../constant/err.type')

class ArticleController {
    async postArticle(ctx, next) {
        console.log(ctx.state);
        const { id, user_name, is_admin } = ctx.state.user
        const { title, content, summary } = ctx.request.body;
        try {
            const res = await createArticle(id, user_name, is_admin, title, content, summary)
            ctx.body = {
                code: 0,
                message: "发帖成功！",
                result: {
                    article_id: res.id,
                    user_id: id,
                    user_name: res.user_name,
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