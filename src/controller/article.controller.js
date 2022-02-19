/*
 * @Author: cos
 * @Date: 2022-02-18 14:15:27
 * @LastEditTime: 2022-02-19 23:32:25
 * @LastEditors: cos
 * @Description: 文章相关控制器
 * @FilePath: \campus-community-backend\src\controller\article.controller.js
 */
const { createArticle, deleteArticleByID, updateArticleByID } = require('../service/article.service')
const { articleCreateError, articleDeleteError, 
    articleParamsError, articleDosNotExist, articleUpdateError} = require('../constant/err.type');

class ArticleController {
    async postArticle(ctx, next) {
        // console.log(ctx.state);
        const { id, user_name, is_admin } = ctx.state.user
        const { title, content, summary } = ctx.request.body;
        if(!title || !content) {
            return ctx.app.emit('error', articleParamsError, ctx);
        }
        // console.log("title:", title, "title type:", typeof title);
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
            console.error('发帖失败！', err);
            ctx.app.emit('error', articleCreateError, ctx)
        }
    }
    async deleteArticle(ctx, next) {
        // console.log("body:", ctx)
        const { article_id } = ctx.request.query
        try {
            const res = await deleteByID(article_id)
            if(!res) {
                console.error("该文章不存在！");
                return ctx.app.emit('error', articleDosNotExist, ctx)
            }
            ctx.body = {
                code: 0,
                message: "删除文章成功！",
            }
        } catch (err) {
            console.error(err);
            return ctx.app.emit('error', articleDeleteError, ctx)
        }
    }
    async updateArticle(ctx, next) {
        const { id, title, content, summary } = ctx.request.body;
        // console.log(id, title, content, summary)
        if(!id) {
            console.error("该文章不存在！");
            return ctx.app.emit('error', articleDosNotExist, ctx)
        }
        const newArticle = {}
        title && Object.assign(newArticle, { title })
        content && Object.assign(newArticle, { content })
        summary && Object.assign(newArticle, { summary })
        // console.log("newArticle", newArticle)
        try {
            const res = await updateArticleByID(id, newArticle)
            if(!res) throw Error()
            ctx.body = {
                code: 0,
                message: "更新文章成功！",
            }
        } catch (err) {
            console.error('更新文章失败！', err);
            return ctx.app.emit('error', articleDosNotExist, ctx)
        }
    
    }
}

module.exports = new ArticleController()